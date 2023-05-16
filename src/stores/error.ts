import { defineStore } from "pinia";

interface State {
  snackbar: boolean;
  error: string;
}

export const useError = defineStore("error", {
  state: (): State => {
    return {
      snackbar: false,
      error: "",
    };
  },
  getters: {
    errorArray: (state) => {
      return state.error.split("\n");
    },
  },
  actions: {
    setError(error: string) {
      this.snackbar = true;
      this.error = error;
      console.log(error);
    },
    close() {
      this.snackbar = false;
    },
  },
});
