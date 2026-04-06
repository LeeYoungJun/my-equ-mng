const modules = import.meta.glob('./members_image/*', { eager: true });

export const memberImages = {};
for (const path in modules) {
  const filename = path.replace('./members_image/', '').replace(/\.(jpg|jpeg|png)$/i, '');
  memberImages[filename] = modules[path].default;
}
