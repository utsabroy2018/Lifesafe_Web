
const wpRoot = import.meta.env.VITE_WP_API_URL || 'https://uat.lifesafemedical.org.in/wp/wp-json/wp/v2'; //UAT
// const wpRoot = import.meta.env.VITE_WP_API_URL || 'http://localhost/lsm_HeadLess/wp-json/wp/v2'; // LOCAL
// const wpRoot = import.meta.env.VITE_WP_API_URL;
const apiRoot = wpRoot.replace(/\/$/, '');

const getJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `WordPress request failed (${response.status})`
    );
  }

  return response.json();
};

export async function getPageBySlug(slug) {
  if (!wpRoot) {
    return null;
  }

  const pages = await getJson(
    `${wpRoot}/pages?slug=${encodeURIComponent(
      slug
    )}&_fields=title,content,excerpt,acf`
  );

  return pages[0] || null;
}

export async function getPageById(id) {
  if (!wpRoot || !id) {
    return null;
  }

  return getJson(
    `${wpRoot}/pages/${encodeURIComponent(id)}?_fields=title,content,excerpt,acf`
  );
}

export async function getMediaById(id) {
  if (!apiRoot || !id) {
    return null;
  }

  return getJson(`${apiRoot}/media/${encodeURIComponent(id)}`);
}

// Menus require a REST menu plugin or a custom WordPress endpoint.
// Configure it here when available.
export async function getNavigation() {
  const endpoint = import.meta.env.VITE_WP_MENU_API_URL;

  return endpoint ? getJson(endpoint) : null;
}

export async function getSiteSettings() {
  const endpoint = import.meta.env.VITE_WP_SETTINGS_API_URL;

  return endpoint ? getJson(endpoint) : null;
}

const getContactForm7Base = () => {
  const baseFromEnv = import.meta.env.VITE_WP_CF7_API_URL;
  if (baseFromEnv) {
    return baseFromEnv.replace(/\/$/, '');
  }

  return wpRoot.replace(/\/wp\/v2\/?$/, '').replace(/\/$/, '');
};

export async function submitContactForm(formId, formData) {
  if (!formId) {
    throw new Error('Contact Form 7 form ID must be provided.');
  }

  const contactForm7Base = getContactForm7Base();
  if (!contactForm7Base) {
    throw new Error('Contact Form 7 endpoint is not configured.');
  }

  const endpoint = `${contactForm7Base}/contact-form-7/v1/contact-forms/${encodeURIComponent(
    formId
  )}/feedback`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const responseBody = await response.text();
  let jsonBody = null;

  try {
    jsonBody = responseBody ? JSON.parse(responseBody) : null;
  } catch {
    jsonBody = null;
  }

  if (!response.ok) {
    const detail =
      jsonBody?.message ||
      (jsonBody && typeof jsonBody === 'object' ? JSON.stringify(jsonBody) : null);
    throw new Error(
      `Contact Form 7 request failed (${response.status})${detail ? `: ${detail}` : ''}`
    );
  }

  return jsonBody || { success: true };
}