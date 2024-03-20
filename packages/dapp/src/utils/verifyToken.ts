export const verifyToken = async (token: string) => {
  try {
    const response = await fetch('/api/supabase/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
