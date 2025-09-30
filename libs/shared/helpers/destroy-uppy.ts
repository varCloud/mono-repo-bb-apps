import Uppy from '@uppy/core';
export const destroyUppy = (uppy: Uppy) => {
  console.log(uppy);
  if (uppy) {
    try {
      uppy.getFiles().forEach((file) => {
        uppy.removeFile(file.id);
      });
      uppy.cancelAll();
      uppy.off('upload-success', () => {});
      uppy.off('upload-error', () => {});
      uppy.off('file-added', () => {});
      uppy.off('cancel-all', () => {});
      uppy.off('file-removed', () => {});
      uppy.close({ reason: 'unmount' });

      uppy = null as any;
    } catch (error) {
      console.error('Error destroying Uppy:', error);
    }
  }
};
