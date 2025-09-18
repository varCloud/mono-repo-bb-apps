export const guessFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return `image/${extension}`;
  } else if (['mp4', 'mov', 'avi'].includes(extension)) {
    return `video/${extension}`;
  } else if (extension === 'pdf') {
    return 'application/pdf';
  }

  return 'application/octet-stream';
};
