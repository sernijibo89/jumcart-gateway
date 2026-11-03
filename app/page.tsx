{/* Corporate Multi-Column Legal Footer */}
      <footer className="border-t border-[#1c232d] bg-[#07090c] mt-16 text-xs text-[#8d98a7]">
        <div className="max-w-[1320px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#8ea3ff] text-[#0a0d18] font-bold grid place-items-center text-xs">J</div>
              <span className="text-sm font-bold text-[#e8ecf1]">JumcartFlow</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-[#5d6877] pt-1">
              <div>Managed by <strong className="text-[#8d98a7]">P. Gonze Consultancy</strong></div>
              <div>Address: Abuja, Nigeria</div>
              <div>Email: <a href="mailto:enquiries@jumcart.com" className="text-[#8ea3ff] hover:underline">enquiries@jumcart.com</a></div>
            </div>
          </div>

          <div>
            <h4 className="font-mono uppercase text-[11px] text-[#e8ecf1] font-semibold mb-3">Trust & Reliability</h4>
            <ul className="space-y-2 text-[12px]">
              <li><button onClick={() => setActiveModal('sla')} className="hover:text-[#e8ecf1]">99.9% Edge SLA</button></li>
              <li><span className="text-[#3ecf8e] text-[11px] font-mono">TLS 1.3 / AES-256 Storage</span></li>
              <li><span className="text-[#8ea3ff] text-[11px] font-mono">HMAC Edge Verification</span></li>
              <li><a href="mailto:enquiries@jumcart.com" className="hover:text-[#e8ecf1]">Incident Escalation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono uppercase text-[11px] text-[#e8ecf1] font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-[12px]">
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-[#e8ecf1]">Terms of Service</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-[#e8ecf1]">Privacy & NDPR Compliance</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1c232d] py-5">
          <div className="max-w-[1320px] mx-auto px-4 flex flex-wrap justify-between items-center text-[11px] text-[#5d6877]">
            <div>© 2026 JumcartFlow. Managed by P. Gonze Consultancy. All rights reserved.</div>
            <div className="font-mono">Autonomous Gateway Protocol v2.4.1</div>
          </div>
        </div>
      </footer>
