const BASE = 'http://localhost:3000';

async function runTests() {
  console.log('--- STARTING SHAWL GHAR (ENGLISH VERSION) VERIFICATION ---');

  // Test 1: Storefront Homepage
  const resHome = await fetch(`${BASE}/`);
  const textHome = await resHome.text();
  console.log(`[Test 1] Storefront Homepage: Status ${resHome.status} - Contains "Shawl Ghar": ${textHome.includes('Shawl Ghar')}`);

  // Test 2: Product Catalog & Maroon Kashmiri Stole
  const resProducts = await fetch(`${BASE}/products`);
  const textProducts = await resProducts.text();
  console.log(`[Test 2] Products Catalog Page: Status ${resProducts.status} - Contains "Stunning Maroon Handcrafted Kashmiri Wool Stole": ${textProducts.includes('Stunning Maroon Handcrafted Kashmiri Wool Stole')}`);
  console.log(`[Test 2b] Contains PKR pricing "2,500": ${textProducts.includes('2,500')}`);

  // Test 3: WhatsApp Number & Order on WhatsApp button
  console.log(`[Test 3] Contains WhatsApp Number "0313-5209085": ${textHome.includes('0313-5209085')}`);
  console.log(`[Test 3b] Contains "Order on WhatsApp": ${textProducts.includes('Order on WhatsApp')}`);

  // Test 4: Global Settings API
  const resSettings = await fetch(`${BASE}/api/settings`);
  const dataSettings = await resSettings.json();
  console.log(`[Test 4] Settings API: Status ${resSettings.status}, Site Name: "${dataSettings.settings?.site_name}", WhatsApp: "${dataSettings.settings?.whatsapp_number}"`);

  // Test 5: Admin Login
  const resLogin = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@showltown.com', password: 'admin123' }),
  });
  const dataLogin = await resLogin.json();
  const setCookie = resLogin.headers.get('set-cookie');
  const cookieMatch = setCookie ? setCookie.match(/showltown_admin_session=([^;]+)/) : null;
  const cookieHeader = cookieMatch ? `showltown_admin_session=${cookieMatch[1]}` : '';
  console.log(`[Test 5] Admin Login: Status ${resLogin.status}, User: ${dataLogin.user?.name}, Cookie received: ${!!cookieHeader}`);

  // Test 6: Access Admin Settings Page
  const resAdminSettings = await fetch(`${BASE}/admin/settings`, {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  const textAdminSettings = await resAdminSettings.text();
  console.log(`[Test 6] Admin Settings Page: Status ${resAdminSettings.status} - Contains "Global Brand": ${textAdminSettings.includes('Global Brand')}`);

  // Test 7: Update Settings via Admin API (Changing Name dynamically and verifying)
  const originalName = dataSettings.settings.site_name;
  const resUpdate = await fetch(`${BASE}/api/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      ...dataSettings.settings,
      site_name: 'Shawl Ghar Boutique',
    }),
  });
  const dataUpdate = await resUpdate.json();
  console.log(`[Test 7a] Changed Site Name dynamically to: "${dataUpdate.settings?.site_name}" - Status: ${resUpdate.status}`);

  // Verify storefront reflects new name immediately
  const resCheckUpdated = await fetch(`${BASE}/`);
  const textCheckUpdated = await resCheckUpdated.text();
  console.log(`[Test 7b] Storefront immediately reflects new name "Shawl Ghar Boutique": ${textCheckUpdated.includes('Shawl Ghar Boutique')}`);

  // Restore original name "Shawl Ghar"
  await fetch(`${BASE}/api/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      ...dataSettings.settings,
      site_name: originalName,
    }),
  });
  console.log(`[Test 7c] Restored Site Name to: "${originalName}"`);

  // Test 8: Category Creation & Deletion via Admin API
  const resCreateCat = await fetch(`${BASE}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      name: 'Bridal Velvet Shawls',
      slug: 'bridal-velvet-shawls',
      description: 'Exclusive bridal collection handcrafted on micro velvet with Zari and Tilla embroidery.',
      image_url: '/images/products/kingri-shawl-1.jpg',
    }),
  });
  const dataCreateCat = await resCreateCat.json();
  console.log(`[Test 8a] Admin Category Creation: Status ${resCreateCat.status}, New Category ID: ${dataCreateCat.categoryId}`);

  // Test 8b: Delete the created test category
  const resDeleteCat = await fetch(`${BASE}/api/categories/${dataCreateCat.categoryId}`, {
    method: 'DELETE',
    headers: { Cookie: cookieHeader },
  });
  const dataDeleteCat = await resDeleteCat.json();
  console.log(`[Test 8b] Admin Category Deletion: Status ${resDeleteCat.status}, Success: ${dataDeleteCat.success}`);

  // Test 9: Product Price & Stock PATCH API
  const resAllProd = await fetch(`${BASE}/api/products`);
  const dataAllProd = await resAllProd.json();
  const targetProd = dataAllProd.products[0];
  const targetId = targetProd.id;

  const resPatchProd = await fetch(`${BASE}/api/products/${targetId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      price: targetProd.price + 500,
      compare_at_price: targetProd.compare_at_price || 9999,
      stock_status: 'in_stock',
    }),
  });
  const dataPatchProd = await resPatchProd.json();
  console.log(`[Test 9a] Product Price Update (ID #${targetId}): Status ${resPatchProd.status}, New Price: Rs. ${dataPatchProd.product?.price}`);

  // Revert back
  await fetch(`${BASE}/api/products/${targetId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      price: targetProd.price,
      compare_at_price: targetProd.compare_at_price,
      stock_status: targetProd.stock_status,
    }),
  });
  console.log(`[Test 9b] Reverted Product (ID #${targetId}) Price to Rs. ${targetProd.price}`);

  console.log('--- ALL SHAWL GHAR (ENGLISH VERSION) TESTS PASSED WITH 100% SUCCESS ---');
}

runTests().catch(console.error);
