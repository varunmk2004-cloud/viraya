# How to Add Images to Products

## Option 1: Add Image to Public Folder (Recommended for Local Development)

1. **Save your image file:**
   - Save the image as `table-linens-main.jpg` (or `.png`, `.webp`, etc.)
   - Recommended size: 800x600px or larger
   - Recommended format: JPG, PNG, or WebP

2. **Place the image in the frontend public folder:**
   ```
   frontend/public/images/table-linens-main.jpg
   ```

3. **Update the seed file:**
   - The seed file is already configured to use `/images/table-linens-main.jpg`
   - This path will work automatically when you place the image in `frontend/public/images/`

4. **Run the seed script:**
   ```bash
   cd backend
   node src/seed/seed.js
   ```

## Option 2: Use External Image URL

1. **Host your image online:**
   - Upload to image hosting service (Imgur, Cloudinary, AWS S3, etc.)
   - Or use your own server/CDN

2. **Update the seed file:**
   - Open `backend/src/seed/seed.js`
   - Find "Luxury Gold Table Linens Set"
   - Replace the image URLs with your hosted URLs:
   ```javascript
   image: 'https://your-image-host.com/path/to/image.jpg',
   images: [
     'https://your-image-host.com/path/to/image1.jpg',
     'https://your-image-host.com/path/to/image2.jpg',
     'https://your-image-host.com/path/to/image3.jpg'
   ]
   ```

3. **Run the seed script:**
   ```bash
   cd backend
   node src/seed/seed.js
   ```

## Option 3: Update via Admin Dashboard

1. **Login to Admin Dashboard:**
   - Go to `/admin/login`
   - Login with admin credentials

2. **Edit the Product:**
   - Navigate to "Products" tab
   - Click "Edit" on "Luxury Gold Table Linens Set"
   - Update the Image URL field with your image URL
   - Click "Save"

## Option 4: Update Database Directly (MongoDB)

1. **Connect to MongoDB:**
   ```bash
   # Using MongoDB Compass or mongo shell
   ```

2. **Update the product:**
   ```javascript
   db.products.updateOne(
     { title: "Luxury Gold Table Linens Set" },
     { 
       $set: { 
         image: "/images/table-linens-main.jpg",
         images: [
           "/images/table-linens-main.jpg",
           "/images/table-linens-1.jpg",
           "/images/table-linens-2.jpg"
         ]
       }
     }
   )
   ```

## Image Requirements

- **Recommended dimensions:** 800x600px or larger
- **File formats:** JPG, PNG, WebP
- **File size:** Keep under 2MB for fast loading
- **Aspect ratio:** 4:3 or 16:9 works best

## Quick Steps (Easiest Method)

1. Save your image as `table-linens-main.jpg`
2. Copy it to: `frontend/public/images/table-linens-main.jpg`
3. Run: `cd backend && node src/seed/seed.js`
4. Refresh your website - the image should appear!

## Notes

- Images in `frontend/public/images/` are served automatically by Vite
- The path `/images/filename.jpg` will work in your React app
- After updating, you may need to clear browser cache (Ctrl+Shift+R)
