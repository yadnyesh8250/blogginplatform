import { Modal, Button, Spinner, FileInput, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api.config';

export default function MediaLibraryPane({ show, onClose, onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchMedia();
    }
  }, [show]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api('/api/upload');
      const data = await res.json();
      if (res.ok) {
        setMedia(data);
      } else {
        setError(data.message || 'Failed to fetch media');
      }
      setLoading(false);
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMedia([data, ...media]);
        setFile(null);
      } else {
        setError(data.message || 'Upload failed');
      }
      setUploading(false);
    } catch (err) {
      setError('Upload failed');
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size='4xl'>
      <Modal.Header>Media Library</Modal.Header>
      <Modal.Body>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4 items-center justify-between border-2 border-dashed border-teal-500 p-4 rounded-lg bg-teal-50 dark:bg-slate-800'>
            <FileInput
              id='media-upload'
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              size='sm'
              onClick={handleUpload}
              disabled={uploading || !file}
            >
              {uploading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Uploading...</span>
                </>
              ) : (
                'Upload New'
              )}
            </Button>
          </div>
          {error && <Alert color='failure'>{error}</Alert>}
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 h-96 overflow-y-auto p-2'>
            {loading && <Spinner className='mx-auto' />}
            {!loading && media.length === 0 && (
              <p className='text-center col-span-full py-10 text-gray-500'>
                No images found. Upload your first one!
              </p>
            )}
            {media.map((item) => (
              <div
                key={item._id}
                className='relative group cursor-pointer border rounded-lg overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all aspect-square bg-gray-100 dark:bg-gray-700'
                onClick={() => onSelect(item.url)}
              >
                <img
                  src={item.url}
                  alt='media'
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all'>
                    <span className='hidden group-hover:block bg-teal-600 text-white text-xs px-2 py-1 rounded'>Select</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color='gray' onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
