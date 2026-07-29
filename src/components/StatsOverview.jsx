import React from 'react';
import { Layers, Send, PhoneCall, Award, XCircle, TrendingUp } from 'lucide-react';

export function StatsOverview({ jobs }) {
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'applied').length;
  const screening = jobs.filter(j => j.status === 'screening').length;
  const interviewing = jobs.filter(j => j.status === 'interviewing').length;
  const offers = jobs.filter(j => j.status === 'offer').length;
  const rejected = jobs.filter(j => j.status === 'rejected').length;

  const activeInterviews = screening + interviewing;
  const responseRate = total > 0 ? Math.round(((activeInterviews + offers) / total) * 100) : 0;

  const cards = [
    {
      title: 'Total Applications',
      value: total,
      subtext: `${applied} pending response`,
      icon: Layers,
      color: '#818cf8',
      bgGlow: 'rgba(99, 102, 241, 0.12)'
    },
    {
      title: 'In Active Pipeline',
      value: activeInterviews,
      subtext: `${screening} screens, ${interviewing} interview loops`,
      icon: PhoneCall,
      color: '#fbbf24',
      bgGlow: 'rgba(251, 191, 36, 0.12)'
    },
    {
      title: 'Offers Extended',
      value: offers,
      subtext: offers > 0 ? 'Congratulations!' : 'Keep pushing forward',
      icon: Award,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.15)'
    },
    {
      title: 'Response Rate',
      value: `${responseRate}%`,
      subtext: 'Screens & interviews vs total',
      icon: TrendingUp,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.12)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={idx} 
            className="glass-panel animate-fade-in"
            style={{ 
              padding: '18px 20px', 
              position: 'relative', 
              overflow: 'hidden',
              background: `linear-gradient(135deg, rgba(17, 24, 39, 0.7), ${card.bgGlow})`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                {card.title}
              </span>
              <div 
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: card.bgGlow,
                  border: `1px solid ${card.color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent size={18} color={card.color} />
              </div>
            </div>
            
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: card.color, marginBottom: '2px' }}>
              {card.value}
            </div>
            
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
