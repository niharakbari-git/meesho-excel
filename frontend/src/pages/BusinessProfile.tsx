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
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Business Profile</h2>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GST Number</label>
            <input {...register('gst')} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default HSN</label>
            <input {...register('hsn')} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand Name</label>
            <input {...register('brand')} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manufacturer</label>
            <input {...register('manufacturer')} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Packer</label>
            <input {...register('packer')} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input {...register('phone')} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
            <textarea {...register('address')} rows={3} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Generation Defaults</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Base Profit (₹)</label>
            <input type="number" {...register('defaultProfit', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price Variation Range (±)</label>
            <input type="number" {...register('defaultPriceVariation', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-fuchsia-500 outline-none transition" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={mutation.isPending} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50">
            {mutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
