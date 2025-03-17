export const arrayBufferToBase64 = (buffer: ArrayBuffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer], { type: "image/jpeg" });
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(",")[1];
      
      if (base64data) {
        resolve(base64data);
      } else {
        reject(new Error("Failed to convert ArrayBuffer to Base64"));
      }
    };

    reader.onerror = (err) => {
      reject(new Error("Error reading file: " + err));
    };

    reader.readAsDataURL(blob);
  });
};

export const bytesToBase64 = (bytes: number[]): string => {
  const binaryString = bytes.map(byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
};