import React, { useEffect, useRef, useState } from 'react';
import { Modal, AutoComplete, Input, Button, Typography, Spin, message } from 'antd';
import { EnvironmentOutlined, AimOutlined, LoadingOutlined } from '@ant-design/icons';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet (when bundlers can't resolve assets)
// CDN icons are fine for most apps; replace with local paths if needed.
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ---------- Types ----------
export type AddressParts = {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
};

export type AddressPayload = {
  fullAddress: string;
  lat: number;
  lng: number;
  parts: AddressParts;
};

export type AddressPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: AddressPayload) => void;
  /** Optional: restrict suggestions to certain country codes like 'in' */
  countryCodes?: string; // e.g., 'in' or 'in,us'
};

// ---------- Helpers ----------
const INIDA_CENTER: LatLngExpression = [20.5937, 78.9629]; // fallback center (India)

function parseAddressParts(fromNominatim: any): AddressParts {
  const a = fromNominatim?.address || {};
  const street = [a.house_number, a.road, a.neighbourhood, a.suburb, a.quarter].filter(Boolean).join(', ');
  const city = a.city || a.town || a.village || a.hamlet || a.municipality || a.county || a.state_district;
  const state = a.state || a.region || a.province || a.state_district;
  const pincode = a.postcode;
  const country = a.country;
  return { street, city, state, pincode, country };
}

async function reverseGeocode(lat: number, lon: number) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('namedetails', '1');
  url.searchParams.set('accept-language', 'en');

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Reverse geocoding failed');
  return await res.json();
}

async function searchPlaces(q: string, countryCodes?: string) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('namedetails', '1');
  url.searchParams.set('limit', '8');
  url.searchParams.set('accept-language', 'en');
  if (countryCodes) url.searchParams.set('countrycodes', countryCodes);

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Place search failed');
  return await res.json();
}

// Recenter map when position changes
function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// Allow map click to set marker & reverse geocode
function ClickToSet({ onSet }: { onSet: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSet(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function AddressPickerModal({ open, onClose, onConfirm, countryCodes = 'in' }: AddressPickerModalProps) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode; raw: any }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [markerPos, setMarkerPos] = useState<LatLngExpression | null>(null);
  const [fullAddress, setFullAddress] = useState('');
  const [parts, setParts] = useState<AddressParts>({});
  const [geoLoading, setGeoLoading] = useState(false);

  // Get current position on open
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setQuery('');
    setOptions([]);

    const getLocation = async () => {
      if (!navigator.geolocation) {
        setMarkerPos(INIDA_CENTER);
        return;
      }
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          setMarkerPos([latitude, longitude]);
          try {
            const rev = await reverseGeocode(latitude, longitude);
            if (cancelled) return;
            setFullAddress(rev.display_name || '');
            setParts(parseAddressParts(rev));
          } catch (e) {
            // ignore
          } finally {
            setGeoLoading(false);
          }
        },
        () => {
          setMarkerPos(INIDA_CENTER);
          setGeoLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 },
      );
    };

    getLocation();

    return () => {
      cancelled = true;
    };
  }, [open]);

  // Debounced search
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 3) {
      setOptions([]);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const list = await searchPlaces(query.trim(), countryCodes);
        const mapped = (list || []).map((item: any) => {
          const labelTop = item.display_name?.split(',')[0] || item.name || item.address?.road || 'Result';
          const labelRest = item.display_name?.replace(labelTop, '').replace(/^,\s*/, '') || '';
          return {
            value: item.display_name,
            label: (
              <div className='flex flex-col'>
                <div style={{ fontWeight: 600 }}>{labelTop}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{labelRest}</div>
              </div>
            ),
            raw: item,
          };
        });
        setOptions(mapped);
      } catch (e: any) {
        message.error('Search failed. Please try again.');
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, countryCodes, open]);

  const handleSelect = (_value: string, option: any) => {
    const item = option.raw;
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setMarkerPos([lat, lon]);
    setFullAddress(item.display_name);
    setParts(parseAddressParts(item));
  };

  const handleSetFromMap = async (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    try {
      const rev = await reverseGeocode(lat, lng);
      setFullAddress(rev.display_name || '');
      setParts(parseAddressParts(rev));
    } catch (e) {
      message.warning('Could not fetch address for this point.');
    }
  };

  const handleUseCurrent = () => {
    if (!navigator.geolocation) return message.warning('Geolocation not supported');
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await handleSetFromMap(latitude, longitude);
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        message.error('Unable to get current location');
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 },
    );
  };

  const canConfirm = !!fullAddress && !!markerPos;

  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <EnvironmentOutlined /> <span>Choose Delivery Address</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnHidden
    >
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <AutoComplete
            style={{ width: '100%' }}
            options={options}
            onSelect={handleSelect}
            onSearch={setQuery}
            placeholder='Search address, area, landmark...'
            notFoundContent={searchLoading ? <Spin indicator={<LoadingOutlined spin />} /> : null}
            allowClear
          >
            <Input size='large' aria-label='Search address' />
          </AutoComplete>
          <Button icon={<AimOutlined />} onClick={handleUseCurrent} aria-label='Use current location' />
        </div>

        <div style={{ height: 360, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
          {markerPos ? (
            <MapContainer center={markerPos} zoom={16} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
              <TileLayer
                // For production traffic, consider hosting your own tiles or using a free-tier provider with an API key.
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='© OpenStreetMap contributors'
              />
              <RecenterMap center={markerPos} />
              <ClickToSet onSet={handleSetFromMap} />
              <Marker
                position={markerPos}
                draggable
                eventHandlers={{
                  dragend: (e: any) => {
                    const ll = (e.target as any).getLatLng();
                    handleSetFromMap(ll.lat, ll.lng);
                  },
                }}
              />
            </MapContainer>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <Spin tip={geoLoading ? 'Fetching your location…' : 'Loading map…'} />
            </div>
          )}
        </div>

        <div className='rounded-md border border-[#eee] p-3 bg-[#fafafa]'>
          <Typography.Text type='secondary'>Selected Address</Typography.Text>
          <div style={{ marginTop: 4, fontWeight: 600 }}>{fullAddress || '—'}</div>
          {parts && (
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.85 }}>
              {parts.street && <div>Street: {parts.street}</div>}
              {parts.city && <div>City: {parts.city}</div>}
              {parts.state && <div>State: {parts.state}</div>}
              {parts.pincode && <div>Pincode: {parts.pincode}</div>}
            </div>
          )}
        </div>

        <div className='flex items-center justify-end gap-2 mt-1'>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type='primary'
            disabled={!canConfirm}
            onClick={() => {
              if (!markerPos) return;
              const [lat, lng] = markerPos as [number, number];
              onConfirm({ fullAddress, lat, lng, parts });
              onClose();
            }}
          >
            Confirm Address
          </Button>
        </div>
      </div>
    </Modal>
  );
}
