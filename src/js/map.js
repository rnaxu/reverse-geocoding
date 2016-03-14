(function() {

  /* Map */
  var Map = (function() {

    function Map(options) {
      this.gmap = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: options.lat,
          lng: options.lng
        },
        zoom: options.zoom
      });
      this.infowindows = [];
      this.mapEvent();
      this.getAddress(options);
    }

    // 地図のイベントをまとめたやつ
    Map.prototype.mapEvent = function() {
      var _this = this;
      var loadFlag;

      // 地図の中心が動いた時
      this.gmap.addListener('center_changed', function() {
        clearTimeout(loadFlag);
        loadFlag = setTimeout(function(){
          var position = _this.getCenteLatLng();
          _this.getAddress(position);
        }, 1000);
      });

      // 地図がクリックされた時
      this.gmap.addListener('click', function() {
        for(var i = 0; i < _this.infowindows.length; i++) {
          _this.infowindows[i].close();
        }
      });
    };

    // GoogleMapの中心の緯度と経度を取得
    Map.prototype.getCenteLatLng = function() {
        var centerLtLn = this.gmap.getCenter();
        return {
            lat: centerLtLn.lat(),
            lng: centerLtLn.lng()
        };
    };

    // 座標から住所を取得
    Map.prototype.getAddress = function(latLng) {
      var _this = this;
      this.noAddress = '地図で表示しているエリア';
      var geocoder = new google.maps.Geocoder;
      var position = {
          lat: latLng.lat,
          lng: latLng.lng
      };
      geocoder.geocode({'location': position}, function(results, status) {
        var address = '';

        if (status === google.maps.GeocoderStatus.OK) {
          var resultLength = results.length;

          for (var i = 0; i < resultLength; i++) {

              // typesがsublocality_level_~だったら
              if(results[i].types[0].match(/^sublocality_level_/)) {

                  address = _this.formatAdress(results[i].formatted_address);

                  // マッチしたらfor文強制終了させる
                  i = resultLength;
              }
          }

          // typesにsublocality_level_~が存在しない場合
          if(address === '') {
              // typesがpremiseだったら
              if(results[0].types[0].match(/premise/)) {
                  address = _this.formatAdress(results[0].formatted_address);
              } else {
                  address = _this.noAddress;
              }
          }

        } else {
          address = _this.noAddress;
        }

        _this.showInfoWindow(address, position);
      });

    };

    // GoogleMapから返ってきた住所を使いやすいように編集
    Map.prototype.formatAdress = function(mapAddress) {
      var _this = this;
      var address = '';

      if(mapAddress.match(/^日本/)) { // 日本国内だったら
        // '日本'と郵便番号を取り除く
        address = mapAddress.replace('日本, ', '').replace(/〒[0-9]{3}-[0-9]{4} /, '');

      } else { // 外国だったら
        address = _this.noAddress;
      }

      return address;
    };

    // インフォウィンドウを表示
    Map.prototype.showInfoWindow = function(contentString, latLng) {
      this.infowindow = new google.maps.InfoWindow({
        content: contentString,
        position: latLng
      });
      this.infowindows.push(this.infowindow);
      this.infowindow.open(this.gmap);
    };

    return Map;

  })();

  /* app */
  var options = {
    lat: 35.681382,
    lng: 139.766084,
    zoom: 15
  };

  var app = new Map(options);

})();