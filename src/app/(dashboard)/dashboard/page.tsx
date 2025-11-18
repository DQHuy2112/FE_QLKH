// src/app/(dashboard)/dashboard/page.tsx

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatCard from '@/components/common/StatCard';
import PieChart from '@/components/charts/PieChart';
import TimeFilter from '@/components/common/TimeFilter';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />

      <main className="ml-[377px] mt-[113px] p-6 pr-8 max-w-[1600px]">
        {/* TỔNG QUAN Section */}
        <section className="animate-fade-in mb-8">
          <div className="bg-white border border-blue-100 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0046ff] to-[#0b08ab] px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="2" width="10" height="10" rx="2" fill="white" opacity="0.9" />
                  <rect x="16" y="2" width="10" height="10" rx="2" fill="white" opacity="0.9" />
                  <rect x="2" y="16" width="10" height="10" rx="2" fill="white" opacity="0.9" />
                  <rect x="16" y="16" width="10" height="10" rx="2" fill="white" opacity="0.9" />
                </svg>
                <h2 className="text-white text-2xl font-bold tracking-wide">TỔNG QUAN</h2>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-8">
                {/* Left side - Pie Chart with Legend - Fixed Width */}
                <div className="w-[480px] flex items-center justify-center flex-shrink-0">
                  <PieChart
                    title="Tỉ lệ xuất - nhập kho"
                    data={[
                      { label: 'Xuất kho', percentage: 63, color: '#FF6B9D' },
                      { label: 'Nhập kho', percentage: 37, color: '#4A90E2' },
                    ]}
                  />
                </div>

                {/* Right side - Time Filter and Stats */}
                <div className="flex-1 flex flex-col gap-5">
                  <div className="flex justify-end">
                    <TimeFilter defaultValue="day" />
                  </div>

                  <StatCard
                    title="Tổng số phiếu"
                    value="52"
                    icon="document"
                    color="teal"
                  />

                  <StatCard
                    title="Tổng lượng tồn kho"
                    value="52,369"
                    icon="inventory"
                    color="teal"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* XUẤT KHO Section */}
        <section className="animate-fade-in mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white border border-blue-100 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0046ff] to-[#0b08ab] px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 6L14 20M14 6L10 10M14 6L18 10"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="6" y="18" width="16" height="5" rx="1.5" fill="white" opacity="0.9" />
                </svg>
                <h2 className="text-white text-2xl font-bold tracking-wide">XUẤT KHO</h2>
              </div>
              <div className="px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-white text-sm font-semibold">709 phiếu</span>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-8">
                {/* Left side - Pie Chart with Legend - Fixed Width */}
                <div className="w-[480px] flex items-center justify-center flex-shrink-0">
                  <PieChart
                    title="Tỉ lệ xuất kho theo nguồn nhận"
                    data={[
                      { label: 'Xuất kho cho NCC', percentage: 11, color: '#FFD700' },
                      { label: 'Xuất kho cho ĐLC1', percentage: 37, color: '#FF6B9D' },
                      { label: 'Hoàn hàng', percentage: 52, color: '#4A90E2' },
                    ]}
                  />
                </div>

                {/* Right side - Time Filter and Stats */}
                <div className="flex-1 flex flex-col gap-5">
                  <div className="flex justify-end">
                    <TimeFilter defaultValue="day" />
                  </div>

                  <StatCard
                    title="Số phiếu xuất kho"
                    value="709"
                    icon="document"
                    color="teal"
                  />

                  <StatCard
                    title="Tổng lượng xuất kho"
                    value="2,238"
                    icon="export"
                    color="teal-light"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NHẬP KHO Section */}
        <section className="animate-fade-in mb-8" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white border border-blue-100 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0046ff] to-[#0b08ab] px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 20L14 6M14 20L10 16M14 20L18 16"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="6" y="18" width="16" height="5" rx="1.5" fill="white" opacity="0.9" />
                </svg>
                <h2 className="text-white text-2xl font-bold tracking-wide">NHẬP KHO</h2>
              </div>
              <div className="px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-white text-sm font-semibold">1,023 phiếu</span>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-8">
                {/* Left side - Pie Chart with Legend - Fixed Width */}
                <div className="w-[480px] flex items-center justify-center flex-shrink-0">
                  <PieChart
                    title="Tỉ lệ nhập kho theo nguồn xuất"
                    data={[
                      { label: 'Nhập kho từ NCC', percentage: 18, color: '#FFD700' },
                      { label: 'Nhập kho từ ĐLC1', percentage: 82, color: '#4A90E2' },
                    ]}
                  />
                </div>

                {/* Right side - Time Filter and Stats */}
                <div className="flex-1 flex flex-col gap-5">
                  <div className="flex justify-end">
                    <TimeFilter defaultValue="month" />
                  </div>

                  <StatCard
                    title="Số phiếu nhập kho"
                    value="1,023"
                    icon="document"
                    color="teal"
                  />

                  <StatCard
                    title="Tổng lượng nhập kho"
                    value="5,206"
                    icon="import"
                    color="teal-light"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
