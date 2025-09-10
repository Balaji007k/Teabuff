class ApiService {

  
  //     ? "https://teabuff.onrender.com" // Render live backend
  //     : "http://localhost:5000";       // Local backend for development


  
  static async fetchData(url, method = "GET", params = null, headers=null) {
    var const_headers = {
          "Content-Type": "application/json",
        };
    try {
      const response = await fetch("http://localhost:5000" + url, {
        method: method,
        credentials: "include",
        headers: headers??const_headers,
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
