const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  uploadVideo: async (videoFile, ambulanceDirection) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('ambulanceDirection', ambulanceDirection);

    const response = await fetch(`${API_BASE_URL}/upload-video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload video');
    }

    return response.json();
  },

  analyzeVideo: async (videoId, ambulanceDirection) => {
    const response = await fetch(`${API_BASE_URL}/analyze-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, ambulanceDirection }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze video');
    }

    return response.json();
  },

  startSimulation: async () => {
    const response = await fetch(`${API_BASE_URL}/simulation/start`, {
      method: 'POST',
    });
    return response.json();
  },

  pauseSimulation: async () => {
    const response = await fetch(`${API_BASE_URL}/simulation/pause`, {
      method: 'POST',
    });
    return response.json();
  },

  resetSimulation: async () => {
    const response = await fetch(`${API_BASE_URL}/simulation/reset`, {
      method: 'POST',
    });
    return response.json();
  },

  getSimulationState: async () => {
    const response = await fetch(`${API_BASE_URL}/simulation/state`);
    return response.json();
  },
};