import os
import subprocess
import sys

def install_and_import(package):
    try:
        import importlib
        importlib.import_module(package)
    except ImportError:
        import pip
        if hasattr(pip, 'main'):
            pip.main(['install', package])
        else:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
        globals()[package] = importlib.import_module(package)

# Install fonttools and brotli
try:
    import fontTools
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'fonttools', 'brotli'])

import fontTools.subset

source_dir = r"c:\Users\rayaa\Downloads\ophir\font"
target_dir = r"c:\Users\rayaa\Downloads\ophir\public\fonts"

# Map source directories to targets
mappings = {
    "optima": "optima",
    "adobe-garamond-pro-2": "adobe-garamond-pro-2"
}

for src_folder, tgt_folder in mappings.items():
    src_path = os.path.join(source_dir, src_folder)
    tgt_path = os.path.join(target_dir, tgt_folder)
    
    if not os.path.exists(tgt_path):
        os.makedirs(tgt_path)

    for filename in os.listdir(src_path):
        if filename.lower().endswith(('.ttf', '.otf')):
            filepath = os.path.join(src_path, filename)
            base_name = os.path.splitext(filename)[0]
            
            woff_path = os.path.join(tgt_path, base_name + '.woff')
            woff2_path = os.path.join(tgt_path, base_name + '.woff2')
            
            print(f"Converting {filename}...")
            
            # Subsetting parameters to retain everything but compress it
            args = [filepath, "*", "--flavor=woff", f"--output-file={woff_path}"]
            try:
                fontTools.subset.main(args)
                print(f"Generated {woff_path}")
            except Exception as e:
                print(f"Error generating woff for {filename}: {e}")
                
            args2 = [filepath, "*", "--flavor=woff2", f"--output-file={woff2_path}"]
            try:
                fontTools.subset.main(args2)
                print(f"Generated {woff2_path}")
            except Exception as e:
                print(f"Error generating woff2 for {filename}: {e}")

print("Font conversion complete.")
