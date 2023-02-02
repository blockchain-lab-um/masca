import { useRouter } from 'next/router';

function useUrlQuery() {
  const router = useRouter();

  return router.query;
}

export default useUrlQuery;
