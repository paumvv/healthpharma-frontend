export const BRANCH_LOCATION = {
  id: '044',
  nombre: 'Sucursal 044 - Santiaguito Tlalcilalcalli',
  direccion: '50904 Santiaguito Tlalcilalcalli, Méx.',
  coordenadas: {
    lat: 19.339968,
    lng: -99.738335
  }
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject({ code: 'UNSUPPORTED', message: 'La geolocalización no está disponible en este dispositivo.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject({ code: 'DENIED', message: 'Permiso de ubicación denegado por el usuario.' });
            break;
          case error.POSITION_UNAVAILABLE:
            reject({ code: 'UNAVAILABLE', message: 'La información de ubicación no está disponible.' });
            break;
          case error.TIMEOUT:
            reject({ code: 'TIMEOUT', message: 'Tiempo de espera agotado al obtener la ubicación.' });
            break;
          default:
            reject({ code: 'UNKNOWN', message: 'Ocurrió un error al obtener la ubicación.' });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};