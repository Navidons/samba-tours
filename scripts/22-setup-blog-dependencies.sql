-- Ensure blog categories exist
INSERT INTO blog_categories (id, name, slug, description) VALUES 
(1, 'Travel Planning', 'travel-planning', 'Tips and guides for planning your Uganda adventure'),
(2, 'Gorilla Trekking', 'gorilla-trekking', 'Everything about gorilla trekking experiences'),
(3, 'Wildlife', 'wildlife', 'Wildlife viewing and safari experiences'),
(4, 'Culture', 'culture', 'Ugandan culture and traditions'),
(5, 'Photography', 'photography', 'Photography tips and techniques')
ON CONFLICT (id) DO NOTHING;

-- Ensure default author profile exists
INSERT INTO profiles (id, full_name, email, avatar_url) VALUES 
('00000000-0000-0000-0000-000000000001', 'Samba Tours Team', 'team@sambatours.com', '/placeholder-user.jpg')
ON CONFLICT (id) DO NOTHING;

-- Now create the blog post
INSERT INTO blog_posts (
  title,
  slug,
  content,
  excerpt,
  category_id,
  author_id,
  status,
  publish_date,
  featured,
  thumbnail,
  read_time,
  tags,
  views,
  likes,
  comments_count
) VALUES (
  'Best Time to Visit Uganda: A Month-by-Month Guide',
  'best-time-to-visit-uganda-a-month-by-month-guide',
  '<p>Planning the perfect time for your Uganda adventure? This comprehensive month-by-month guide will help you choose the ideal time based on weather, wildlife viewing, and seasonal highlights.</p>

<h2>Dry Seasons: Peak Travel Times</h2>
<p>Uganda has two main dry seasons that offer the best conditions for most activities:</p>

<h3>December to February</h3>
<p>This is one of Uganda''s peak tourist seasons, offering excellent weather conditions and optimal wildlife viewing opportunities. Temperatures are warm but comfortable, and rainfall is minimal.</p>

<h3>June to August</h3>
<p>The second dry season coincides with the Northern Hemisphere''s summer holidays. This period offers the best conditions for gorilla trekking and wildlife safaris.</p>

<h2>Wet Seasons: Unique Advantages</h2>
<p>Don''t overlook the wet seasons - they offer their own unique advantages:</p>

<h3>March to May</h3>
<p>The long rains bring lush green landscapes and fewer crowds. It''s an excellent time for birdwatching as migratory species arrive.</p>

<h3>September to November</h3>
<p>The short rains create beautiful scenery and offer more affordable rates. Wildlife is still easily spotted, and the weather is generally pleasant.</p>

<h2>Activity-Specific Timing</h2>
<ul>
  <li><strong>Gorilla Trekking:</strong> Year-round, but dry seasons offer easier hiking conditions</li>
  <li><strong>Wildlife Safaris:</strong> Dry seasons for easier game viewing</li>
  <li><strong>Birdwatching:</strong> November to April for migratory species</li>
  <li><strong>White Water Rafting:</strong> Year-round, with higher water levels during rains</li>
</ul>

<h2>Month-by-Month Breakdown</h2>

<h3>January</h3>
<p>Excellent weather with minimal rainfall. Perfect for all activities including gorilla trekking, wildlife safaris, and cultural visits.</p>

<h3>February</h3>
<p>Similar to January with great conditions. Peak season for wildlife viewing in national parks.</p>

<h3>March</h3>
<p>Beginning of the long rains. Lush landscapes and fewer tourists. Great for birdwatching.</p>

<h3>April</h3>
<p>Peak of the long rains. Challenging conditions for some activities but beautiful scenery and lower prices.</p>

<h3>May</h3>
<p>Rains begin to decrease. Good time for budget travelers with improving conditions.</p>

<h3>June</h3>
<p>Start of the second dry season. Excellent conditions return for all activities.</p>

<h3>July</h3>
<p>Peak tourist season with perfect weather. Book accommodations and permits well in advance.</p>

<h3>August</h3>
<p>Continuing excellent conditions. Ideal for gorilla trekking and wildlife photography.</p>

<h3>September</h3>
<p>Beginning of short rains. Still good conditions with fewer crowds.</p>

<h3>October</h3>
<p>Short rains continue. Good for budget travel with pleasant weather.</p>

<h3>November</h3>
<p>Rains decrease. Excellent birdwatching as migratory species arrive.</p>

<h3>December</h3>
<p>Start of the main dry season. Perfect conditions for all activities.</p>

<h2>Tips for Choosing Your Travel Time</h2>
<ul>
  <li>Consider your budget - wet seasons offer better rates</li>
  <li>Book gorilla permits 6-12 months in advance for peak season</li>
  <li>Pack appropriate clothing for the season you choose</li>
  <li>Be flexible with your itinerary during wet seasons</li>
  <li>Consider combining with other East African destinations</li>
</ul>',
  'Plan your perfect Uganda adventure with our comprehensive guide to weather, wildlife, and seasonal highlights.',
  1, -- Travel Planning category
  '00000000-0000-0000-0000-000000000001', -- Default author ID
  'published',
  NOW(),
  true,
  '/placeholder.svg?height=600&width=1200',
  '8 min read',
  ARRAY['Travel Planning', 'Weather', 'Seasons', 'Uganda', 'Best Time'],
  2450,
  89,
  0
) ON CONFLICT (slug) DO NOTHING; 