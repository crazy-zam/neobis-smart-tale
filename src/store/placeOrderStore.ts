import { makeAutoObservable } from 'mobx';
import uniqid from 'uniqid';

interface IImage {
  type: 'currentImages' | 'additionalImages';
  index: number;
  id: string;
}
interface IAction {
  action: 'ADD' | 'MOVE' | 'REMOVE' | 'REPLACE';
  arrayPosition?: number;
  targetPosition?: number;
  filePosiiton?: number;
}
interface ADD {
  action: 'ADD';
  targetPosition: number;
  filePosiiton: number;
}
interface MOVE {
  action: 'MOVE';
  arrayPosition: number;
  targetPosition: number;
}
interface REMOVE {
  action: 'REMOVE';
  arrayPosition: number;
}
interface REPLACE {
  action: 'REPLACE';
  arrayPosition: number;
  filePosiiton: number;
}

export default class PlaceOrderStore {
  isLoading = false;
  firstAd = true;
  showForm = true;
  type = 'equipment';
  currentImages: Array<string> = [];
  #viewedImages: IImage[] = [];
  #oldImages: IImage[] = [];
  additionalImages: Array<string> = [];
  additionalFiles: File[] = [];
  viewedImages: Array<string> = [];
  imageActions: IAction[] = [];

  constructor(imagesArr: string[]) {
    this.currentImages = imagesArr;
    imagesArr.forEach((val, ind) => {
      this.#viewedImages.push({ index: ind, type: 'currentImages', id: uniqid() });
    });
    this.#oldImages = [...this.#viewedImages];
    this.updateViewed();
    makeAutoObservable(this, {}, { autoBind: true });
  }
  setType = (type: 'equipment' | 'services') => {
    this.type = type;
  };
  calcActions = () => {
    let currentView = [...this.#oldImages];
    const newView = [...this.#viewedImages];
    let filePointer = 0;
    const length = currentView.length - 1;
    for (let i = length; i >= 0; i--) {
      if (!newView.some((obj) => obj.id === currentView[i].id)) {
        let action: REPLACE | ADD | REMOVE | MOVE;
        if (currentView.length <= newView.length) {
          console.log('action add/replace');
          if (filePointer < this.additionalFiles.length) {
            action = {
              action: 'REPLACE',
              arrayPosition: i,
              filePosiiton: filePointer,
            };
            filePointer += 1;
            currentView.splice(i, 1, newView[i]);
          } else {
            console.log('testing', currentView.length, newView.length);
            action = {
              action: 'ADD',
              targetPosition: i,
              filePosiiton: filePointer,
            };
            currentView = [...currentView, newView[i]];
          }
          // currentView.push(newView[i]);
        } else {
          console.log('action remove');
          action = {
            action: 'REMOVE',
            arrayPosition: i,
          };
          currentView.splice(i, 1);
          for (let j = i; j < currentView.length; j++) {
            currentView[j].index -= 1;
          }
        }
        this.imageActions.push(action);
      }
    }
    currentView = currentView.filter((curObj) =>
      newView.some((obj) => obj.id === curObj.id),
    );
    let newPostion = currentView.length;

    newView.forEach((obj, ind) => {
      if (!currentView.some((obj) => obj.id === newView[ind].id)) {
        this.imageActions.push({
          action: 'ADD',
          targetPosition: newPostion,
          filePosiiton: obj.index,
        });
        newPostion += 1;
      }
    });
    return this.imageActions;
  };
  updateViewed = () => {
    this.viewedImages = this.#viewedImages.map((cur) => {
      return this[cur.type][cur.index];
    });
  };
  addImage = async (file: File) => {
    const ind = this.additionalImages.length;
    this.additionalFiles.push(file);
    this.additionalImages.push(URL.createObjectURL(file));
    this.#viewedImages.push({ index: ind, type: 'additionalImages', id: uniqid() });
    this.updateViewed();
  };
  deleteImage = (ind: number) => {
    const deletedImage = this.#viewedImages.splice(ind, 1)[0];
    this[deletedImage.type].splice(deletedImage.index, 1);
    this.#viewedImages = this.#viewedImages.map((obj) => {
      if (obj.type !== deletedImage.type) return obj;
      if (obj.index < deletedImage.index) return obj;
      return { ...obj, index: obj.index - 1 };
    });
    if (deletedImage.type === 'additionalImages') {
      this.additionalFiles.splice(deletedImage.index, 1);
      this.imageActions = this.imageActions.filter((obj) => obj.targetPosition !== ind);
    }
    this.updateViewed();
  };

  replaceImage = (file: File, ind: number) => {
    const imageToChange = this.#viewedImages[ind];
    const additionalInd = this.additionalImages.length;
    if (imageToChange.type === 'additionalImages') {
      this.additionalFiles.splice(imageToChange.index, 1, file);
      this.additionalImages.splice(imageToChange.index, 1, URL.createObjectURL(file));
      this.#viewedImages.splice(ind, 1, {
        index: imageToChange.index,
        type: 'additionalImages',
        id: uniqid(),
      });
    } else {
      this.additionalFiles.push(file);
      this.additionalImages.push(URL.createObjectURL(file));
      this.#viewedImages.splice(ind, 1, {
        index: additionalInd,
        type: 'additionalImages',
        id: uniqid(),
      });
    }

    this.#viewedImages = this.#viewedImages.map((obj) => {
      if (obj.type !== imageToChange.type) return obj;
      if (obj.index < imageToChange.index) return obj;
      return { ...obj, index: obj.index - 1 };
    });
    this.updateViewed();
  };
}
