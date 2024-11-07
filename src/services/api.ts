import type { AuthResponse, Note } from "../types";

// const API_URL = "https://hjv21rabxd.execute-api.us-east-1.amazonaws.com/dev";
const API_URL = "http://localhost:3000/dev";

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new ApiError(error.message || "An error occurred", response.status);
  }
  return response.json();
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    return response; // Return the response for further handling
  } catch (error) {
    console.error("Fetch error:", error); // Log the error for debugging
    throw new ApiError("Network error occurred"); // Throw a custom error
  }
}

const authApi = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    const response = await fetchWithAuth(`${API_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<AuthResponse>(response);
    if (!data.token)
      throw new ApiError("Invalid response from server: missing token");
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetchWithAuth(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<AuthResponse>(response);
    if (!data.token)
      throw new ApiError("Invalid response from server: missing token");
    return data;
  },
};

const notesApi = {
  async getAll(): Promise<Note[]> {
    const response = await fetchWithAuth(`${API_URL}/notes`);
    return handleResponse<Note[]>(response);
  },

  async create(data: { title: string; content: string }): Promise<Note> {
    const response = await fetchWithAuth(`${API_URL}/notes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return handleResponse<Note>(response);
  },

  async getById(id: string): Promise<Note> {
    const response = await fetchWithAuth(`${API_URL}/notes/${id}`);
    return handleResponse<Note>(response);
  },

  async update(
    id: string,
    data: { title: string; content: string }
  ): Promise<Note> {
    const response = await fetchWithAuth(`${API_URL}/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return handleResponse<Note>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/notes/${id}`, {
      method: "DELETE",
    });
    await handleResponse<void>(response);
  },
};

export const api = {
  auth: authApi,
  notes: notesApi,
};
