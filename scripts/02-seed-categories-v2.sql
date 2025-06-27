-- Seed initial tour categories - Version 2
INSERT INTO tour_categories (name, slug, description) VALUES
('Wildlife Safari', 'wildlife-safari', 'Experience Uganda''s incredible wildlife in their natural habitats'),
('Gorilla Trekking', 'gorilla-trekking', 'Meet mountain gorillas up close in Bwindi and Mgahinga'),
('Cultural Tours', 'cultural-tours', 'Immerse yourself in Uganda''s rich cultural heritage'),
('Adventure Tours', 'adventure-tours', 'Thrilling outdoor adventures and challenging expeditions'),
('Bird Watching', 'bird-watching', 'Discover Uganda''s amazing bird diversity with expert guides'),
('Nature Walks', 'nature-walks', 'Peaceful walks through Uganda''s beautiful landscapes');

SELECT 'Tour categories seeded successfully - Version 2!' as status;
