const API_BASE_URL = "http://localhost:8000/api";

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token: string) => localStorage.setItem("token", token);
export const removeAuthToken = () => localStorage.removeItem("token");

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An unexpected error occurred");
  }

  return data;
}

export const api = {
  auth: {
    login: (body: any) => request("/users/login", { method: "POST", body: JSON.stringify(body), requiresAuth: false }),
    register: (body: any) => request("/users/register", { method: "POST", body: JSON.stringify(body), requiresAuth: false }),
    getProfile: (userId: string) => request(`/users/${userId}`),
    updateProfile: (userId: string, body: any) => request(`/users/${userId}`, { method: "PUT", body: JSON.stringify(body) }),
  },
  progress: {
    startLesson: (body: any) => request("/progress/lesson/start", { method: "POST", body: JSON.stringify(body) }),
    completeLesson: (body: any) => request("/progress/lesson/complete", { method: "POST", body: JSON.stringify(body) }),
    submitExercise: (body: any) => request("/progress/exercise/submit", { method: "POST", body: JSON.stringify(body) }),
    submitQuiz: (body: any) => request("/progress/quiz/submit", { method: "POST", body: JSON.stringify(body) }),
    get: (userId: string, courseId?: string) => {
        const query = courseId ? `?courseId=${courseId}` : "";
        return request(`/progress/${userId}${query}`);
    },
    getStats: (userId: string) => request(`/progress/${userId}/stats`),
    getStreak: (userId: string) => request(`/progress/${userId}/streak`),
  },
};
