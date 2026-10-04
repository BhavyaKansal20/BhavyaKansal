import re

with open('src/components/Projects.tsx', 'r') as f:
    content = f.read()

# Replace TechIcon
tech_icon_pattern = r'const TechIcon.*?;\n};'
simple_tech_icon = """const TechIcon = ({ name }: { name: string }) => {
  return (
    <div className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 bg-secondary/70 text-secondary-foreground border border-border/60 hover:bg-secondary">
      {name}
    </div>
  );
};"""
content = re.sub(tech_icon_pattern, simple_tech_icon, content, flags=re.DOTALL)

# Remove metrics chips on the image to reduce clutter
metrics_pattern = r'\{\/\* Bottom metrics chips \*\/.*?\}\)\}\s*<\/div>\s*\)\}'
content = re.sub(metrics_pattern, '', content, flags=re.DOTALL)

# Simplify card layout, remove messy gradient background
card_content_pattern = r'<div className="flex flex-col flex-grow p-5 lg:p-6 bg-gradient-to-b from-background/90 to-background/50 backdrop-blur-xl">'
simple_card_content = '<div className="flex flex-col flex-grow p-5 lg:p-6 bg-card">'
content = content.replace(card_content_pattern, simple_card_content)

# Simplify the card wrapper container background
card_wrapper_pattern = r'className=\{`group relative flex flex-col rounded-\[24px\] overflow-hidden cursor-pointer bg-card/40 border border-border/40 hover:border-border/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 \$\{\s*isCardVisible \? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"\s*\}`\}'
simple_card_wrapper = r'className={`group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-card border border-border/50 hover:border-foreground/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] ${isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}'
content = re.sub(card_wrapper_pattern, simple_card_wrapper, content, flags=re.DOTALL)

with open('src/components/Projects.tsx', 'w') as f:
    f.write(content)
