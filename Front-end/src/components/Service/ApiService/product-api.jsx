
class ApiService {
  // static Backend = "https://teabuff.onrender.com";
  
   // Dynamically set backend URL
  static Backend = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://teabuff.onrender.com";


  static async fetchData(url, method = "GET", params = null, headers = null) {
    let options = {
      method,
      credentials: "include",
      headers: headers || {},
    };

    // If params is FormData → don’t stringify & don’t set Content-Type
    if (params instanceof FormData) {
      options.body = params;
    } else if (params && (method === "POST" || method === "PATCH" || method === "PUT")) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(params);
    }

    try {
      const response = await fetch(this.Backend + url, options);
      const data = await response.json();

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

