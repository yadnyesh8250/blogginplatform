import { THEMES } from './themes';

export default function ThemePicker({ selected, onChange }) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-2 gap-3'>
        {THEMES.map((theme) => {
          const isSelected = selected === theme.id;
          return (
            <button
              key={theme.id}
              type='button'
              onClick={() => onChange(theme.id)}
              title={theme.description}
              className={`
                relative group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-violet-500 shadow-lg shadow-violet-500/20 scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-400 hover:scale-[1.01]'
                }
              `}
            >
              {/* Color Swatch */}
              <div
                className='w-full h-14 rounded-lg overflow-hidden'
                style={{ background: theme.previewGradient }}
              >
                {/* Fake text lines overlay for preview */}
                <div className='w-full h-full flex flex-col justify-end p-2 gap-1'>
                  <div
                    className='h-1.5 rounded-full w-3/4 opacity-70'
                    style={{ background: theme.accent }}
                  />
                  <div className='h-1 rounded-full w-full bg-white/30' />
                  <div className='h-1 rounded-full w-5/6 bg-white/20' />
                </div>
              </div>

              {/* Theme Info */}
              <div className='text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <span className='text-base leading-none'>{theme.icon}</span>
                  <span className='text-xs font-bold text-gray-800 dark:text-white'>{theme.name}</span>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className='absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center'>
                  <svg className='w-2.5 h-2.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Theme Description */}
      {selected && (
        <div
          className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium'
          style={{
            background: THEMES.find(t => t.id === selected)?.previewGradient,
            color: '#fff',
          }}
        >
          <span className='text-base'>{THEMES.find(t => t.id === selected)?.icon}</span>
          <div>
            <div className='font-bold'>{THEMES.find(t => t.id === selected)?.name}</div>
            <div className='opacity-80'>{THEMES.find(t => t.id === selected)?.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}
