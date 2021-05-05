import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ConfigFile} from "../dtos/definition-class";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private properties: any;
  private configFile: ConfigFile;
  private propsName = 'propsName';

  constructor(private http: HttpClient) {
  }

  public async load(): Promise<any> {
    this.configFile = await this.getConfigFile();
    if (this.configFile) {
      this.properties = await this.getProperties();
      localStorage.setItem(this.propsName, JSON.stringify(this.properties));
    }
  }

  public get(key: string): any {
    return JSON.parse(localStorage.getItem(this.propsName))[key];
  }

  private getConfigFile(): Promise<any> {
    return this.http.get('assets/config/config.json')
      .pipe(map((data: any) => {
        return data;
      }))
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.warn(`No config file`);
        return null;
      });
  }

  private async getConfigProperty(name: string, profile: string): Promise<any> {
    return this.http.get(this.configFile.url + `${name}/${profile}`).pipe(
      map((data) => {
        return data;
      }))
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error(`Error getting properties ${err}`);
        return null;
      });
  }

  private async getProperties(): Promise<any> {
    let merged: any = {};
    if (this.configFile.names) {
      for (const name of this.configFile.names) {
        await this.getConfigProperty(name, this.configFile.profile).then((result) => {
          if (result) {
            result['propertySources'].forEach(e => {
              if (e['name'].includes(this.configFile.profile)) {
                merged = Object.assign(merged, e['source']);
              }
            });
          }
        });
      }
    }
    return merged;
  }
}

export function loadConfig(config: ConfigService): any {
  return () => config.load();
}
