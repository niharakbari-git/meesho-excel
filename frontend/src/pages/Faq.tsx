import { faqData } from '../config/faqData';

export default function Faq() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-extrabold text-[#1c1950]">FAQ & Cautions</h2>
           <p className="text-slate-500 mt-2 font-medium">Important guidelines and best practices for bulk uploading catalogs on Meesho.</p>
        </div>
      </div>

      <div className="space-y-10">
        {faqData.map((section, idx) => (
          <div key={idx} className="glass-card p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-6 border-b border-slate-100 pb-4">{section.category}</h3>
            <div className="space-y-6">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                  <h4 className="text-lg font-bold text-[#1c1950] mb-2 flex items-start">
                    <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {item.question}
                  </h4>
                  <p className="text-slate-600 font-medium ml-7 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
