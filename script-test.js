import http from "k6/http";
import { check, sleep, group } from "k6";

// Import Laporan dalam bentuk Website HTML
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

//baseURL
const BASE_URL = "https://reqres.in";

// Opsi Pengujian
export const options = {
  vus: 1000, // virtual user sebanyak 1000
  iterations: 3500,
  thresholds: {
    http_req_duration: ["avg < 2000"], //reponse API max 2s
    http_req_failed: ["rate < 0.1"], // 1% tingkat kegagalan
  },
};

// Konfigurasi Pengujian
export default function () {
  const name = "morpheus";
  const job = "zion resident";

  // Create User [POST] Request
  // API Create
  group("Create user should success", function () {
    const FULL_URL = BASE_URL + "/api/users";
    const payload = JSON.stringify({
      name: name,
      job: job,
    });
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let res = http.post(FULL_URL, payload, params);

    check(res, {
      "Correct status code is 201": (res) => res.status == 201,
    });
    check(res, {
      "response name should same with request": (res) => {
        const response = JSON.parse(res.body);
        return response.name === name;
      },
    });
    check(res, {
      "response job should same with request": (res) => {
        const response = JSON.parse(res.body);
        return response.job === job;
      },
    });
  });
  sleep(1);

  // Update User [PUT] Request
  // API Update
  group("Update user should success", function () {
    const FULL_URL = BASE_URL + "/api/users/2";
    const payload = JSON.stringify({
      name: name,
      job: job,
    });
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let res = http.put(FULL_URL, payload, params);

    check(res, {
      "Correct status code is 200": (res) => res.status == 200,
    });
    check(res, {
      "response name should same with request": (res) => {
        const response = JSON.parse(res.body);
        return response.name === name;
      },
    });
    check(res, {
      "response job should same with request": (res) => {
        const response = JSON.parse(res.body);
        return response.job === job;
      },
    });
  });
  sleep(1);
}

// Pembuatan laporan HTML dan tampilan teks
export function handleSummary(data) {
  return {
    "report.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
