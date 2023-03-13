import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private api_key: string = 'CtbSNZMFPFlbWl1x5KQjtqPOHnE1ema5';
  private servicio_url: string = 'https://api.giphy.com/v1/gifs';

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor ( private http: HttpClient ) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query:string) {
    query = query.trim().toLocaleLowerCase();

    if ( !this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,9);
      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
    }

    const params = new HttpParams()
        .set('api_key', this.api_key )
        .set('limit', '12')
        .set('q', query );

    //console.log(this._historial);
    //console.log(`https://api.giphy.com/v1/gifs/search?api_key=CtbSNZMFPFlbWl1x5KQjtqPOHnE1ema5&q=${ query }&limit=10`);
    //this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=CtbSNZMFPFlbWl1x5KQjtqPOHnE1ema5&q=${ query }&limit=10`)
    this.http.get<SearchGifsResponse>(`${ this.servicio_url }/search`, { params } )
      .subscribe ( (response) => {
        console.log(response.data);
        this.resultados = response.data;
        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );
      });
  }
}
