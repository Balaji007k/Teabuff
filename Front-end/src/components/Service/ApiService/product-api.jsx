class ApiService {
  // static BASE_URL =
  //   process.env.NODE_ENV === "production"
  //     ? "https://teabuff.onrender.com" // Render live backend
  //     : "http://localhost:5000";       // Local backend for development


  static async fetchData(url, method = "GET", params = null) {
    try {
      const response = await fetch("https://teabuff.onrender.com" + url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          method === "POST" || method === "PUT"
            ? JSON.stringify(params)
            : null,
      });

      const data = await response.json();

      // 🚨 Throw if HTTP status is not OK
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
