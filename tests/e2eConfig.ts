type Config = {
  baseUrl: string;
};

let config: Config | null = null;

export const get = () => {
  if (!config) {
    const baseUrl = process.env.BASE_URL;

    config = {
      baseUrl
    };
  }

  return config!;
};
