export const arrayBufferToBase64 = (buffer: ArrayBuffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log("primeiros 10 bytes:", new Uint8Array(buffer).slice(0, 10));
    const blob = new Blob([buffer], { type: "image/jpeg" });
    console.log(blob);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(",")[1];
      
      if (base64data) {
        console.log("Base64 data: ", base64data);
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