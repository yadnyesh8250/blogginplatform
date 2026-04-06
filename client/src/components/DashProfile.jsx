import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle, HiPencil, HiCamera, HiLogout, HiTrash, HiDocumentText, HiShieldCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.config';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&limit=3`);
        const data = await res.json();
        if (res.ok) setUserPosts(data.posts);
      } catch (err) { console.log(err.message); }
    };
    fetchUserPosts();
  }, [currentUser._id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => { if (imageFile) uploadImage(); }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUploadProgress(0);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageFile);

      // Using standard XHR to track progress since fetch doesn't support it directly
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setImageFileUrl(data.url);
          setFormData({ ...formData, profilePicture: data.url });
          setImageFileUploading(false);
          setImageFileUploadProgress(null);
        } else {
          const data = JSON.parse(xhr.responseText);
          setImageFileUploadError(data.message || 'Could not upload image');
          setImageFileUploading(false);
          setImageFileUploadProgress(null);
        }
      };

      xhr.onerror = () => {
        setImageFileUploadError('Could not upload image (Network Error)');
        setImageFileUploading(false);
        setImageFileUploadProgress(null);
      };

      xhr.send(formDataUpload);
    } catch (error) {
      setImageFileUploadError('Something went wrong during upload');
      setImageFileUploading(false);
      setImageFileUploadProgress(null);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) { setUpdateUserError('No changes made'); return; }
    if (imageFileUploading) { setUpdateUserError('Please wait for image to upload'); return; }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Profile updated successfully! ✨');
      }
    } catch (error) { dispatch(updateFailure(error.message)); }
  };

  const handleDeleteUser = async () => {
    setShowDeleteModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) dispatch(deleteUserFailure(data.message));
      else dispatch(deleteUserSuccess(data));
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) { console.log(error.message); }
  };

  const joinedDate = new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const avatarUrl = imageFileUrl || currentUser.profilePicture;
  const initials = currentUser.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>

        {/* ── Profile Hero Card ── */}
        <div className='relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700'>
          {/* Gradient Banner */}
          <div className='h-40 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 relative'>
            <div className='absolute inset-0 opacity-20' style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className='px-6 pb-6'>
            {/* Avatar + Basic Info Row */}
            <div className='flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6'>
              {/* Avatar */}
              <div
                className='relative cursor-pointer group flex-shrink-0'
                onClick={() => filePickerRef.current.click()}
              >
                <div className='w-32 h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500'>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt='profile'
                      className={`w-full h-full object-cover transition-opacity ${imageFileUploadProgress && imageFileUploadProgress < 100 ? 'opacity-50' : ''}`}
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-4xl font-black text-white'>
                      {initials}
                    </div>
                  )}
                  {imageFileUploadProgress && imageFileUploadProgress < 100 && (
                    <div className='absolute inset-0'>
                      <CircularProgressbar
                        value={imageFileUploadProgress || 0}
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{ root: { width: '100%', height: '100%' }, path: { stroke: '#6366f1' } }}
                      />
                    </div>
                  )}
                </div>
                <div className='absolute bottom-2 right-2 w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity'>
                  <HiCamera className='text-white text-lg' />
                </div>
              </div>

              {/* Name & Badge row */}
              <div className='flex-1 pb-1'>
                <div className='flex items-center flex-wrap gap-2'>
                  <h1 className='text-2xl font-black text-slate-900 dark:text-white'>
                    @{currentUser.username}
                  </h1>
                  {currentUser.isAdmin && (
                    <span className='flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full'>
                      <HiShieldCheck /> Admin
                    </span>
                  )}
                </div>
                <p className='text-sm text-gray-500 mt-1'>{currentUser.email}</p>
                <p className='text-xs text-gray-400 mt-0.5'>Member since {joinedDate}</p>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-2'>
                {currentUser.isAdmin && (
                  <Link to='/create-post'>
                    <button className='flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg'>
                      <HiDocumentText /> New Post
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className='grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl'>
              {[
                { label: 'Posts', value: userPosts.length + '+' },
                { label: 'Role', value: currentUser.isAdmin ? 'Admin' : 'Author' },
                { label: 'Status', value: 'Active' },
              ].map(stat => (
                <div key={stat.label} className='text-center'>
                  <p className='text-xl font-black text-slate-900 dark:text-white'>{stat.value}</p>
                  <p className='text-xs text-gray-500 uppercase tracking-wider'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Edit Profile Form ── */}
        <div className='bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-6'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center'>
              <HiPencil className='text-indigo-600 dark:text-indigo-400 text-lg' />
            </div>
            <div>
              <h2 className='font-bold text-lg text-slate-900 dark:text-white'>Edit Profile</h2>
              <p className='text-xs text-gray-500'>Update your personal information</p>
            </div>
          </div>

          <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
          {imageFileUploadError && <Alert color='failure' className='mb-4'>{imageFileUploadError}</Alert>}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5'>Username</label>
              <input
                type='text'
                id='username'
                defaultValue={currentUser.username}
                onChange={handleChange}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all'
                placeholder='Your username'
              />
            </div>

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5'>Email</label>
              <input
                type='email'
                id='email'
                defaultValue={currentUser.email}
                onChange={handleChange}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all'
                placeholder='your@email.com'
              />
            </div>

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5'>New Password</label>
              <input
                type='password'
                id='password'
                onChange={handleChange}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all'
                placeholder='Leave blank to keep current password'
              />
            </div>

            <button
              type='submit'
              disabled={loading || imageFileUploading}
              className='w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-lg'
            >
              {loading ? 'Saving...' : '✨ Save Changes'}
            </button>
          </form>

          {updateUserSuccess && <Alert color='success' className='mt-4'>{updateUserSuccess}</Alert>}
          {updateUserError && <Alert color='failure' className='mt-4'>{updateUserError}</Alert>}
          {error && <Alert color='failure' className='mt-4'>{error}</Alert>}
        </div>

        {/* ── Recent Posts ── */}
        {userPosts.length > 0 && (
          <div className='bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-bold text-lg text-slate-900 dark:text-white'>Your Recent Posts</h2>
              <Link to='/dashboard?tab=posts' className='text-xs font-bold text-indigo-500 hover:underline'>View all →</Link>
            </div>
            <div className='space-y-3'>
              {userPosts.map(post => (
                <Link to={`/post/${post.slug}`} key={post._id}>
                  <div className='flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group'>
                    <div className='w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-200 to-purple-200'>
                      {post.image && <img src={post.image} alt={post.title} className='w-full h-full object-cover' />}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors'>{post.title}</p>
                      <p className='text-xs text-gray-500 mt-0.5'>{new Date(post.createdAt).toLocaleDateString()} · {post.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold flex-shrink-0 ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {post.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Danger Zone ── */}
        <div className='bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800 p-6'>
          <h2 className='font-bold text-base text-red-700 dark:text-red-400 mb-4'>Danger Zone</h2>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={() => setShowDeleteModal(true)}
              className='flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-400 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors'
            >
              <HiTrash /> Delete Account
            </button>
            <button
              onClick={handleSignout}
              className='flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'
            >
              <HiLogout /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-4'>
            <div className='w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
              <HiOutlineExclamationCircle className='h-12 w-12 text-red-500' />
            </div>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>Delete Account?</h3>
            <p className='text-gray-500 text-sm mb-6'>This action is permanent and cannot be undone. All your posts and data will be erased.</p>
            <div className='flex justify-center gap-3'>
              <button
                onClick={handleDeleteUser}
                className='px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors'
              >
                Yes, Delete Forever
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
