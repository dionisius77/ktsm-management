import React, { useMemo, useState } from 'react';
import { MdClose, MdPlace } from 'react-icons/md';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Input } from 'react-daisyui';
import { FiSearch } from 'react-icons/fi';

interface MapProps {
  googleMapsApiKey: string;
}

const Map: React.FC<MapProps> = ({ googleMapsApiKey }): JSX.Element => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  const handleSelectLocation = (selectedData: any) => {
    setSearchTerm(selectedData)
    setResultVisible(false)
  }

  const handleSearchLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setResultVisible(true)
  }

  const handleResetLocation = () => {
    setSearchTerm('')
    setResultVisible(false)
  }

  if (!isLoaded) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className='z-[98] w-[40%] absolute top-2 px-4 bg-white flex items-center gap-2'>
        <span>
          <FiSearch size={20} color='black' />
        </span>
        <Input
          value={searchTerm}
          placeholder='Search by location'
          className='rounded-none border-none focus:outline-none w-full bg-white'
          onChange={handleSearchLocation}
        />

        { searchTerm && <span onClick={handleResetLocation} className='cursor-pointer hover:bg-slate-200 p-2 rounded-full'>
          <MdClose size={20} color='black' />
        </span> }

        {resultVisible && (
          <div className='absolute top-[100%] left-0 bg-white w-full h-[200px] overflow-y-auto'>
            <div onClick={() => handleSelectLocation('SMPN Surabaya 1')} className='px-4 py-2 cursor-pointer hover:bg-slate-200 flex gap-2'>
              <MdPlace size={20} color='black'/>
              <span>SMPN Surabaya 1</span>
            </div>
            <div onClick={() => handleSelectLocation('SMPN Surabaya 2')} className='px-4 py-2 cursor-pointer hover:bg-slate-200 flex gap-2'>
              <MdPlace size={20} color='black'/>
              <span>SMPN Surabaya 2</span>
            </div>
            <div onClick={() => handleSelectLocation('SMPN Surabaya 3')} className='px-4 py-2 cursor-pointer hover:bg-slate-200 flex gap-2'>
              <MdPlace size={20} color='black'/>
              <span>SMPN Surabaya 3</span>
            </div>
          </div>
        )}
      </div>
      <GoogleMap
        mapContainerClassName='h-full w-full'
        center={center}
        zoom={10}
      />
    </>
  );
};

export default Map;
