import { Injectable } from '@angular/core';
import { map, of, Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class BaseinfoService {

  citys: any[] = [];
  refreshDictTypeList$ = new Subject();
  refreshDictDataList$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshDictTypeList() {
    this.refreshDictTypeList$.next('');
  }

  getDictTypeList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('baseinfo/dictType/list', {
      ...condition
    })
  }

  createDictType(obj: any) {
    return this.httpService.httpPostObservable('baseinfo/dictType/create', {
      ...obj
    });
  }

  updateDictTypeById(obj: any, id: number) {
    return this.httpService.httpPostObservable(
      'baseinfo/dictType/updateById' + this.httpService.encode({ id }),
      { ...obj })
  }

  deleteDictTypeById(id: number) {
    return this.httpService.httpGetObservable('baseinfo/dictType/deleteById', { id });
  }

  refreshDictDataList() {
    this.refreshDictDataList$.next('');
  }

  getDictDataList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('baseinfo/dictData/list', {
      ...condition
    });
  }

  getDictDataListByTypeId(typeId: number) {
    return this.httpService.httpGetObservable('baseinfo/dictData/listByTypeId', {
      dictTypeId: typeId
    });
  }

  createDictData(obj: any) {
    return this.httpService.httpPostObservable('baseinfo/dictData/create', {
      ...obj
    });
  }

  updateDictDataById(obj: any, id: number) {
    return this.httpService.httpPostObservable('baseinfo/dictData/updateById'
      + this.httpService.encode({ id }), {
      ...obj
    });
  }

  deleteDictDataById(id: number) {
    return this.httpService.httpGetObservable('baseinfo/dictData/deleteById',
      { id })
  }

  getCityList() {
    if (this.citys && this.citys.length > 0) {
      return of(this.citys);
    }
    return this.httpService.httpGetObservable('baseinfo/city', {}).pipe(map(json => {
      if (json.code === 200) {
        this.citys = this.createCityOptions(json.data, -1);
      }
      return this.citys;
    }));
  }

  getCitySelect() {
    return this.httpService.httpGetObservable('baseinfo/citySelect', {})
  }


  createCityOptions(citys: any[], pId: number): any[] {
    const arr: any[] = [];
    const childCitys = citys.filter(x => x.parentId === pId);
    childCitys.forEach(x => {
      const obj: any = {
        label: x.cityName, value: x.cityName
      }
      const children = this.createCityOptions(citys, x.id);
      if (children.length > 0) {
        obj.children = children;
      } else {
        obj.isLeaf = true
      }
      arr.push(obj);
    });
    return arr;
  }
}
