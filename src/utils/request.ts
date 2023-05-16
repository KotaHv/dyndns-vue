import ky from "ky";
import { useError } from "@/stores/error";

const service = ky.extend({
  prefixUrl: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  hooks: {
    afterResponse: [
      (req, op, res) => {
        if (res.status == 404) {
          return new Response(null, { status: 200 });
        }
        return res;
      },
    ],
    beforeError: [
      async (err) => {
        const store = useError();
        const reason = (await err.response.json()).error;
        store.setError(reason);
        return err;
      },
    ],
  },
});
export default service;
