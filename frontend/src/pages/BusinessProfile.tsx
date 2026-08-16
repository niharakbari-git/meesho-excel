import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

type ProfileForm = {
  gst: string;
  hsn: string;
  brand: string;
  manufacturer: string;
  packer: string;
  address: string;
  phone: string;
  email: string;
  defaultKeywords: string;
  defaultProfit: number;
  defaultPriceVariation: number;
};

export default function BusinessProfile() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: api.getProfile });
  
  const { register, handleSubmit } = useForm<ProfileForm>({
    values: data?.data || {}
  });

  const mutation = useMutation({
    mutationFn: api.saveProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Profile saved successfully!');
    }
  });

  if (isLoading) return <div className="text-center p-10 text-slate-500">Loading profile...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-extrabold text-[#1c1950]">Business Profile</h2>
           <p className="text-slate-500 mt-2 font-medium">Configure default GST, HSN, and Brand information for global fallbacks.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">GST Number</label>
              <input {...register('gst')} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default HSN</label>
              <input {...register('hsn')} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brand Name</label>
              <input {...register('brand')} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manufacturer</label>
              <input {...register('manufacturer')} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Packer</label>
              <input {...register('packer')} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
              <input {...register('phone')} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address</label>
              <textarea {...register('address')} rows={3} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-slate-100">
            <button type="submit" disabled={mutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-indigo-600/20 transition transform hover:-translate-y-0.5 disabled:opacity-50">
              {mutation.isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
