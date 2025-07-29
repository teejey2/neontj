interface BackboardOptionsProps {
  selectedStyle: string;
  selectedColor: string;
  onStyleSelect: (style: string) => void;
  onColorSelect: (color: string) => void;
}

export default function BackboardOptions({
  selectedStyle,
  selectedColor,
  onStyleSelect,
  onColorSelect
}: BackboardOptionsProps) {
  const styles = [
    { id: 'cut-to-letter', label: 'Cut to Letter', popular: true },
    { id: 'rectangle', label: 'Rectangle', popular: false },
    { id: 'cut-to-shape', label: 'Cut to Shape', popular: false },
    { id: 'fine-cut', label: 'Fine Cut', popular: true },
    { id: 'none', label: 'No Backboard', popular: false },
  ];

  const colors = [
    { id: 'clear', label: 'Clear', popular: true },
    { id: 'black', label: 'Black', popular: false },
    { id: 'white', label: 'White', popular: false },
    { id: 'mirror', label: 'Mirror', popular: false },
  ];

  return (
    <div className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6"> 
      <h3 className="text-xl font-heading text-iceBlue mb-4">BACKBOARD OPTIONS</h3>

      <div className="mb-6"> 
        <h4 className="font-bold mb-3">CHOOSE BACKBOARD STYLE</h4>
        <div className="grid grid-cols-2 gap-3"> 
          {styles.map((style) => ( 
            <button 
              key={style.id} 
              className={`p-3 rounded-lg border-2 text-center text-sm relative ${ 
                selectedStyle === style.id 
                ? 'border-neonPurple bg-neonPurple/10 shadow-neon' 
                : 'border-gray-700 hover:border-iceBlue' 
              }`} 
              onClick={() => onStyleSelect(style.id)} 
            > 
              {style.label} 
              {style.popular && ( 
                <span className="absolute -top-2 -right-2 bg-neonPurple text-bgBlack text-xs px-2 py-1 rounded-full"> 
                  POPULAR 
                </span> 
              )} 
            </button> 
          ))} 
        </div> 
      </div>

      {selectedStyle !== 'none' && ( 
        <div> 
          <h4 className="font-bold mb-3">CHOOSE BACKBOARD COLOR</h4> 
          <div className="grid grid-cols-2 gap-3"> 
            {colors.map((color) => ( 
              <button 
                key={color.id} 
                className={`p-3 rounded-lg border-2 text-center text-sm relative ${ 
                  selectedColor === color.id 
                  ? 'border-neonPurple bg-neonPurple/10 shadow-neon'
                  : 'border-gray-700 hover:border-iceBlue'
                }`} 
                onClick={() => onColorSelect(color.id)} 
              > 
                {color.label}
                {color.popular && (
                  <span className="absolute -top-2 -right-2 bg-neonPurple text-bgBlack text-xs px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}