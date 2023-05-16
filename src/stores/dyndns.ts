import { defineStore } from "pinia";
import { DynDNS } from "@/types/dyndns";
import * as api from "@/api/dyndns";

interface State {
  dynDNS: DynDNS;
  status: boolean;
}

export const useDynDNS = defineStore("dyndns", {
  state: (): State => {
    return {
      dynDNS: {
        server: "",
        username: "",
        password: "",
        hostname: "",
        ip: 1,
        interface: "",
        sleep_interval: 10,
      },
      status: false,
    };
  },
  getters: {
    created(state) {
      return state.status ? true : false;
    },
  },
  actions: {
    async getDynDNS() {
      const data = await api.get();
      if (data) {
        this.$patch({ dynDNS: data, status: true });
      } else {
        this.status = false;
      }
    },
    async update() {
      if (this.created) {
        const data = await api.update(this.dynDNS);
        this.$patch({ dynDNS: data });
      } else {
        const data = await api.create(this.dynDNS);
        this.$patch({ dynDNS: data, status: true });
      }
    },
  },
});
