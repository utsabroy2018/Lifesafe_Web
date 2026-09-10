import { useEffect, useState } from 'react';

export default function useAsync(action, dependencies = []) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let alive = true;

    setState({
      loading: true,
      error: null,
      data: null,
    });

    action()
      .then((data) => {
        if (alive) {
          setState({
            loading: false,
            error: null,
            data,
          });
        }
      })
      .catch((error) => {
        if (alive) {
          setState({
            loading: false,
            error: error.message,
            data: null,
          });
        }
      });

    return () => {
      alive = false;
    };
  }, dependencies);

  return state;
}