import React, { useState, useEffect } from 'react';
import { Instagram, Video, Layers, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './InstagramFeed.css';

const InstagramFeed = ({ variant = 'premium', limit = 3 }) => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Placeholder for Instagram profile URL
    const instagramProfileUrl = "https://www.instagram.com/ophirpropertiesofficial/";

    useEffect(() => {
        const fetchInstagramPosts = async () => {
            setLoading(true);
            try {
                // Backend endpoint as specified by the user
                const response = await fetch(`/api/instagram/latest?limit=${limit}`);

                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                setPosts(data);
                setError(false);
            } catch (err) {
                console.error('Instagram fetch error:', err);
                setError(true);

                // For demonstration/development purposes, if the API is not yet live
                // uncomment the following to see how the UI looks with data:
                /*
                setPosts([
                    {
                        id: '1',
                        mediaType: 'IMAGE',
                        mediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                        permalink: '#',
                        caption: 'Exploring luxury residences in the heart of Downtown Dubai. #OphirLuxury',
                        timestamp: new Date().toISOString()
                    },
                    {
                        id: '2',
                        mediaType: 'VIDEO',
                        mediaUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80',
                        permalink: '#',
                        caption: 'Breathtaking views of the Palm Jumeirah. Experience ultimate elegance.',
                        timestamp: new Date().toISOString()
                    },
                    {
                        id: '3',
                        mediaType: 'CAROUSEL_ALBUM',
                        mediaUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
                        permalink: '#',
                        caption: 'Exclusive off-plan launches coming soon. Stay ahead of the market.',
                        timestamp: new Date().toISOString()
                    }
                ]);
                setError(false);
                */
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramPosts();
    }, [limit]);

    const renderIcon = (type) => {
        switch (type) {
            case 'VIDEO': return <Video size={16} />;
            case 'CAROUSEL_ALBUM': return <Layers size={16} />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className={variant === 'premium' ? 'insta-container' : 'insta-compact-container'}>
                {variant === 'premium' && (
                    <div className="insta-header">
                        <div className="insta-skeleton" style={{ width: '200px', height: '14px', margin: '0 auto 20px' }}></div>
                        <div className="insta-skeleton" style={{ width: '400px', height: '40px', margin: '0 auto' }}></div>
                    </div>
                )}
                <div className={variant === 'premium' ? 'insta-grid' : 'insta-compact-grid'}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={variant === 'premium' ? 'insta-post-card' : 'insta-compact-card'}>
                            <div className="insta-media-wrapper insta-skeleton"></div>
                            {variant === 'premium' && (
                                <div className="insta-content">
                                    <div className="insta-skeleton" style={{ height: '14px', marginBottom: '10px' }}></div>
                                    <div className="insta-skeleton" style={{ height: '14px', width: '70%', marginBottom: '20px' }}></div>
                                    <div className="insta-skeleton" style={{ height: '12px', width: '40%' }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={variant === 'premium' ? 'insta-container' : 'insta-compact-container'}>
                <div className="insta-error-state">
                    <p className="insta-error-text">{t('instagram.errorText')}</p>
                    <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                        {t('instagram.visitBtn')}
                    </a>
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className="insta-compact-container">
                <div className="insta-compact-header">
                    <h3 className="insta-compact-title">{t('instagram.compactTitle')}</h3>
                    <Instagram size={20} className="gold-text" />
                </div>
                <div className="insta-compact-grid">
                    {posts.map(post => (
                        <a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="insta-compact-card"
                        >
                            <img src={post.mediaUrl} alt="" className="insta-media" />
                            {post.mediaType !== 'IMAGE' && (
                                <div className="insta-type-overlay">
                                    {renderIcon(post.mediaType)}
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="instagram-feed-section">
            <div className="insta-container">
                <div className="insta-header">
                    <span className="small-label">{t('instagram.label')}</span>
                    <h2 className="section-title">{t('instagram.title')}</h2>
                    <div className="gold-accent-line" style={{ margin: '0 auto' }}></div>
                </div>

                <div className="insta-grid">
                    {posts.map(post => (
                        <div key={post.id} className="insta-post-card">
                            <div className="insta-media-wrapper">
                                <img src={post.mediaUrl} alt="" className="insta-media" />
                                <div className="insta-hover-overlay"></div>
                                {post.mediaType !== 'IMAGE' && (
                                    <div className="insta-type-overlay">
                                        {renderIcon(post.mediaType)}
                                    </div>
                                )}
                            </div>
                            <div className="insta-content">
                                {post.caption && (
                                    <p className="insta-caption">{post.caption}</p>
                                )}
                                <span className="insta-date">{formatDate(post.timestamp)}</span>
                                <a
                                    href={post.permalink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="insta-card-link"
                                >
                                    {t('instagram.viewBtn')} <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="insta-footer-cta">
                    <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        {t('instagram.followBtn')}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
