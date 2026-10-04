import re

with open('src/index.css', 'r') as f:
    css = f.read()

# Update the before element for the body
mesh_light = """  body::before {
    content: '';
    position: fixed;
    inset: -50%;
    z-index: -1;
    background: 
      radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08), transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.08), transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.08), transparent 50%);
    animation: premiumMesh 20s ease-in-out infinite alternate;
    pointer-events: none;
    background-color: hsl(var(--background));
  }"""

mesh_dark = """  .dark body::before {
    background: 
      radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.12), transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.12), transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.12), transparent 50%);
    background-color: hsl(var(--background));
  }"""

css = re.sub(r'body::before\s*{[^}]+}\s*\.dark body::before\s*{[^}]+}', mesh_light + '\n\n' + mesh_dark, css, flags=re.DOTALL)

# Let's ensure glass-card has cleaner borders and backdrop blur.
css = css.replace('--glass-border: 0 0% 100% / 0.4;', '--glass-border: 0 0% 0% / 0.05;')
css = css.replace('--glass-border: 255 255% 255% / 0.1;', '--glass-border: 255 255% 255% / 0.1;')

# Replace body background with mesh gradient
with open('src/index.css', 'w') as f:
    f.write(css)
