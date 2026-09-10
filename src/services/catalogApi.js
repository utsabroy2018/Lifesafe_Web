import axios from 'axios';
import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';
import { categories as fallbackCategories, products as fallbackProducts } from '../data/catalogFallback';


const storeRoot = import.meta.env.VITE_WC_API_URL || 'https://uat.lifesafemedical.org.in/wp/wp-json/wc/v3'; // UAT
// const storeRoot = import.meta.env.VITE_WC_API_URL || 'http://localhost/lsm_HeadLess/wp-json/wc/v3'; // LOCAL
// const storeRoot = import.meta.env.VITE_WC_API_URL;
const proxyRoot = import.meta.env.VITE_CATALOG_API_PROXY_URL;
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || 'ck_1fa126f8d73e62635f2c8173a2b0346d718a4bd4';
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || 'cs_1dc086f800f06b269e29dd90852c138bdc9876b5';

const cleanHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();
const decodeHtmlEntities = (value = '') => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
};

const mapCategory = (item) => ({
  id: item.id,
  parent_id: item.parent_id || item.parent || 0,
  slug: item.slug,
  name: decodeHtmlEntities(item.name),
  description: cleanHtml(item.description),
  image: item.image?.src || item.image?.thumbnail || '/assets/images/cat/a.jpg',
  count: item.count,
});
const mapProduct = (item) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  short_description: item.short_description || '',
  description: item.description,
  image: item.images?.[0]?.src || item.images?.[0]?.thumbnail,
  images: item.images?.map((image) => image.src) || [],
  category: item.categories?.[0]?.slug,
  features:
    item.attributes?.filter((attribute) => attribute.name.toLowerCase() === 'features')[0]?.terms?.map((term) => term.name) || [],
  specifications: Object.fromEntries(
    (item.attributes || [])
      .filter((attribute) => attribute.name.toLowerCase() !== 'features')
      .map((attribute) => [attribute.name, attribute.terms?.map((term) => term.name).join(', ')]),
  ),
});

const api = axios.create({
  baseURL: proxyRoot ? proxyRoot.replace(/\/$/, '') : storeRoot.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
});

const oauth = new OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
  },
});

api.interceptors.request.use((config) => {
  if (proxyRoot || !CONSUMER_KEY || !CONSUMER_SECRET) return config;

  const method = (config.method || 'get').toUpperCase();
  const url = `${storeRoot.replace(/\/$/, '')}${config.url?.startsWith('/') ? config.url : `/${config.url || ''}`}`;

  const requestData = {
    url,
    method,
    data: config.params || {},
  };

  const authData = oauth.authorize(requestData);

  if (method === 'POST' || method === 'PUT') {
    const urlWithQueryParams = new URL(url);
    Object.keys(authData).forEach((key) => urlWithQueryParams.searchParams.append(key, authData[key]));
    config.url = urlWithQueryParams.pathname.replace('/wp/wp-json/wc/v3', '') + urlWithQueryParams.search;
  } else {
    config.params = {
      ...(config.params || {}),
      ...authData,
    };
    config.url = config.url?.startsWith('/') ? config.url : `/${config.url || ''}`;
  }

  return config;
}, (error) => Promise.reject(error));

const request = async (path, opts = {}) => {
  const response = await api.get(path, { params: opts.params });
  return response.data;
};

export async function getCategories() {
  if (!storeRoot && !proxyRoot) return fallbackCategories;
  const response = await api.get('/products/categories', { params: { per_page: 100 } });
  return (response.data || []).map(mapCategory);
}

export async function getProducts(categorySlug) {
  if (!storeRoot && !proxyRoot) return categorySlug ? fallbackProducts.filter((product) => product.category === categorySlug) : fallbackProducts;

  let categoryId = categorySlug;
  if (categorySlug && !proxyRoot) {
    const allCategories = await getCategories();
    categoryId = allCategories.find((category) => category.slug === categorySlug)?.id;
    if (!categoryId) return [];
  }

  const params = { per_page: 100 };
  if (categoryId) params.category = categoryId;
  const response = await api.get('/products', { params });
  return (response.data || []).map(mapProduct);
}

export async function getProduct(slug) {
  if (!storeRoot && !proxyRoot) return fallbackProducts.find((p) => p.slug === slug) || null;
  const response = await api.get('/products', { params: { slug } });
  const item = Array.isArray(response.data) ? response.data[0] : response.data;
  return item ? mapProduct(item) : null;
}
