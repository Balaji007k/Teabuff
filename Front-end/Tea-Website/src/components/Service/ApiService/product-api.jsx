class ApiService {
  static async fetchData(url, method = "GET", params = null) {
    try {
      const response = await fetch("http://localhost:5000" + url, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === "POST" || method === "PUT" ? JSON.stringify(params) : null,
      });

      const data = await response.json();

      // 🚨 Throw if HTTP status is not OK (like 404, 401, etc.)
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return { Result: data, Error: null };
    } catch (err) {
      return { Result: null, Error: err.message || "Something went wrong" };
    }
  }
}


export default ApiService;
