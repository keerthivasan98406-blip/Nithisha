import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export const defaultSettings = {
  shop_name: 'Nithisha Collection',
  tagline: 'Your little world of pretty things',
  logo_text: 'Nithisha Collection',
  hero_badge: 'Accessories · Styles · Elegance',
  hero_title: 'Jewellery That Tells Your Story',
  hero_subtitle: 'Elegant, affordable and uniquely you.',
  hero_image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1920&q=85',
  hero_image_2: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1920&q=85',
  hero_image_3: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1920&q=85',
  whatsapp_number: '+919080772273',
  phone_number: '+91 90807 72273',
  email: 'hello@nithishacollection.in',
  instagram_url: 'https://instagram.com/nithisha_collection',
  shop_address: 'Boutique Suite 402, Rosewood Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
  opening_hours: 'Mon - Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM',
  about_title: 'Crafting Everyday Luxury for Every Woman',
  about_story: "Founded with a passion for modern elegance, Nithisha Collection brings you premium, runway-inspired fashion jewellery without luxury markups. We believe that stunning jewellery shouldn't be reserved only for royal lockers or rare weddings—it belongs in your everyday moments, your celebrations, and your personal style story.",
  about_philosophy: 'From anti-tarnish everyday rings to show-stopping cocktail earrings, every design in our catalogue is handpicked for impeccable craftsmanship, lightweight comfort, and radiant finishing.',
  about_quality: 'Skin-friendly alloys, durable high-grade plating, premium cubic zirconia, baroque faux pearls, and artisan enamel—curated to stay brilliant.',
  about_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  owner_name: 'Nithisha',
  owner_title: 'Boutique Owner & Lead Curator',
  owner_email: 'hello@nithishacollection.in',
  owner_phone: '+91 90807 72273',
  owner_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
