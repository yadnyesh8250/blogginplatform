import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiTrash, HiShieldCheck, HiUser, HiMail, HiCalendar } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { api } from '../utils/api.config';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) { console.log(error.message); }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await api(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) { console.log(error.message); }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await api(`/api/user/delete/${userIdToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      }
    } catch (error) { console.log(error.message); }
  };

  return (
    <div className='p-6 md:p-10 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>User Management</h1>
          <p className='text-slate-500 font-medium'>Oversee platform members and community roles.</p>
        </div>
        <div className='px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold text-sm'>
          {users.length} Users Total
        </div>
      </div>

      {currentUser.isAdmin && users.length > 0 ? (
        <div className='space-y-4'>
          {/* Header Row (Desktop) */}
          <div className='hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400'>
             <div className='col-span-4'>User Details</div>
             <div className='col-span-3'>Email Adress</div>
             <div className='col-span-2 text-center'>Role</div>
             <div className='col-span-3 text-right'>Actions</div>
          </div>

          <div className='space-y-3'>
            {users.map((user) => (
              <div key={user._id} className='bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 group'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
                  
                  {/* Avatar & Username */}
                  <div className='col-span-1 md:col-span-4 flex items-center gap-4'>
                    <div className='relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 p-0.5 border border-slate-200 dark:border-slate-600 shadow-sm'>
                       <img src={user.profilePicture} alt={user.username} className='w-full h-full rounded-[14px] object-cover' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-base font-bold text-slate-900 dark:text-white truncate capitalize'>
                        {user.username}
                      </p>
                      <div className='flex items-center gap-1.5 text-[10px] text-slate-400 font-bold'>
                        <HiCalendar className='text-slate-300' /> Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className='col-span-1 md:col-span-3 truncate'>
                     <p className='text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2'>
                        <HiMail className='text-slate-300' /> {user.email}
                     </p>
                  </div>

                  {/* Admin Status */}
                  <div className='col-span-1 md:col-span-2 text-center'>
                     {user.isAdmin ? (
                       <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] font-black uppercase'>
                         <HiShieldCheck size={14} /> Admin
                       </span>
                     ) : (
                       <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 text-[10px] font-black uppercase'>
                         <HiUser size={14} /> Author
                       </span>
                     )}
                  </div>

                  {/* Actions */}
                  <div className='col-span-1 md:col-span-3 flex justify-end gap-2'>
                    {/* Only show delete if user is not current user */}
                    {user._id !== currentUser._id ? (
                      <button 
                        onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }} 
                        className='flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all font-bold text-xs active:scale-95'
                      >
                         <HiTrash size={16} /> Delete
                      </button>
                    ) : (
                      <span className='text-[10px] font-bold text-slate-300 italic px-4 py-2 uppercase'>You (Active)</span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {showMore && (
            <button onClick={handleShowMore} className='w-full py-4 text-sm font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors'>
              Load more users ↓
            </button>
          )}
        </div>
      ) : (
        <div className='text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700'>
          <HiUser className='mx-auto h-16 w-16 text-slate-300 mb-4' />
          <h3 className='text-xl font-bold text-slate-900 dark:text-white'>No users found</h3>
        </div>
      )}

      {/* Delete User Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-4'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-red-500 mb-4 mx-auto' />
            <h3 className='mb-2 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>Delete User?</h3>
            <p className='mb-6 text-sm text-slate-500'>This will permanently remove the user and all their associated content from the system.</p>
            <div className='flex justify-center gap-3'>
              <button 
                onClick={handleDeleteUser} 
                className='px-6 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95 transition-all'
              >
                Confirm Delete
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className='px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all'
              >
                Keep User
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}