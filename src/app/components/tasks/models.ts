interface AppFormData {
    appId: string;
    envType: string;
    metrics: {
      fileSystemType: string;
      alertType: string;
      email?: string;
      slack?: string;
      condition: string;
      threshold: number;
      mountPath: string;
    }[];
  }