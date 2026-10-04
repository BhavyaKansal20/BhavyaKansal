import re

with open('src/components/Timeline.tsx', 'r') as f:
    content = f.read()

# Add Dialog imports
imports = """import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTiltCard } from "@/hooks/useTiltCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
"""
content = re.sub(r'import \{ useEffect.*?useTiltCard";', imports, content, flags=re.DOTALL)

# Update company name for CODE METRICS
content = content.replace('company: "CODE METRICS Research Society",', 'company: "CODE METRICS Research Society (TIET, CSED & DORSP)",')

# Remove the delay in useScrollAnimation by modifying TimelineItemDesktop and TimelineItemMobile
# Replace translate/opacity logic
content = content.replace(
    '`w-full flex-1 pt-8 px-4 transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`',
    '`w-full flex-1 pt-8 px-4 transition-all duration-300 ease-out opacity-100 translate-y-0`'
)

content = content.replace(
    '`ml-4 transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`',
    '`ml-4 transition-all duration-300 ease-out opacity-100 translate-y-0`'
)

# Update the certificate button to use Dialog
cert_button = """
      {item.certificate && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-2 mt-5 px-5 py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <Maximize2 className="w-4 h-4" /> View Certificate
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-1 bg-black/90 border-none">
            {item.certificate.endsWith('.pdf') ? (
              <iframe src={item.certificate} className="w-full h-[80vh] rounded-md bg-white" />
            ) : (
              <img src={item.certificate} alt="Certificate" className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
            )}
          </DialogContent>
        </Dialog>
      )}
"""

old_cert_button = r'\{item\.certificate && \(\s*<a[^>]*href=\{item\.certificate\}[^>]*>\s*View Certificate\s*</a>\s*\)\}'
content = re.sub(old_cert_button, cert_button, content, flags=re.DOTALL)

with open('src/components/Timeline.tsx', 'w') as f:
    f.write(content)
