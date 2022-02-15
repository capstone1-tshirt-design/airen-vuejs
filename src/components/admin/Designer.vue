<template>
  <div class="d-flex">
    <div class="card">
      <div class="card-body">
        <ul class="avatar-list">
          <li v-for="(avatar, index) in avatars" :key="index">
            <a @click.prevent="onAvatarClick" href="#">
              <img :src="require('../../assets/images/temp/' + avatar)" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <ul class="color-list">
          <li v-for="(color, index) in colors" :key="index">
            <a
              class="color-preview"
              :style="{ backgroundColor: color.hexCode }"
              :title="color.name"
              @click.prevent="onColorClick($event, color.hexCode)"
              href="#"
            ></a>
          </li>
        </ul>
      </div>
    </div>
    <div class="shirt-wrapper" :style="{ backgroundColor: shirtColor }">
      <img
        id="shirt"
        :src="require('../../assets/images/temp/crew_front.png')"
      />
      <div
        class="drawing-area"
        @mouseover.prevent="onMouseOverDA"
        @mouseout.prevent="onMouseOutDA"
      >
        <div class="canvas-container">
          <canvas
            ref="shirtDesigner"
            :width="200"
            :height="400"
            id="shirtDesigner"
          />
        </div>
      </div>
      <button class="btn btn-primary" @click.prevent="addToCart">
        <i class="mdi mdi-plus"></i>
      </button>
      <button class="btn btn-secondary">
        Add to Cart <span class="badge bg-primary">{{ orderCount }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric'

export default {
  name: 'TshirtDesigner',
  data() {
    return {
      canvas: null,
      shirtColor: '#ffffff',
      orderCount: 0
    }
  },
  computed: {
    avatars() {
      return [
        'invisibleman.jpg',
        'gladi.png',
        'truck.png',
        'lsd.png',
        'storm.png'
      ]
    },
    colors() {
      return [
        {
          name: 'White',
          hexCode: '#ffffff'
        },
        {
          name: 'Dark Heather',
          hexCode: '#616161'
        },
        {
          name: 'Gray',
          hexCode: '#f0f0f0'
        },
        {
          name: 'Charcoal',
          hexCode: '#5b5b5b'
        },
        {
          name: 'Black',
          hexCode: '#222222'
        },
        {
          name: 'Heather Orange',
          hexCode: '#fc8d74'
        },
        {
          name: 'Heather Dark Chocolate',
          hexCode: '#432d26'
        },
        {
          name: 'Salmon',
          hexCode: '#eead91'
        },
        {
          name: 'Chesnut',
          hexCode: '#806355'
        },
        {
          name: 'Dark Chocolate',
          hexCode: '#382d21'
        }
      ]
    },
    line1() {
      return new fabric.Line([0, 0, 200, 0], {
        stroke: '#000000',
        strokeWidth: 1,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        selectable: false
      })
    },
    line2() {
      return new fabric.Line([199, 0, 200, 399], {
        stroke: '#000000',
        strokeWidth: 1,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        selectable: false
      })
    },
    line3() {
      return new fabric.Line([0, 0, 0, 400], {
        stroke: '#000000',
        strokeWidth: 1,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        selectable: false
      })
    },
    line4() {
      return new fabric.Line([0, 400, 200, 399], {
        stroke: '#000000',
        strokeWidth: 1,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        selectable: false
      })
    }
  },
  methods: {
    addToCart() {
      this.orderCount++
    },
    initFabric() {
      this.canvas = new fabric.Canvas('shirtDesigner', {
        hoverCursor: 'pointer',
        selection: true,
        selectionBorderColor: 'blue'
      })
      const canvas = this.canvas
      this.canvas.on({
        'object:moving': (e) => {
          e.target.opacity = 0.5
        },
        'object:modified': (e) => {
          e.target.opacity = 1
        },
        'object:selected': this.onObjectSelected.bind(this),
        'selection:cleared': this.onSelectedCleared.bind(this)
      })
      // piggyback on `canvas.findTarget`, to fire "object:over" and "object:out" events
      this.canvas.findTarget = (function (originalFn) {
        return function () {
          const target = originalFn.apply(this, arguments)
          if (target) {
            if (this._hoveredTarget !== target) {
              canvas.fire('object:over', { target: target })
              if (this._hoveredTarget) {
                canvas.fire('object:out', { target: this._hoveredTarget })
              }
              this._hoveredTarget = target
            }
          } else if (this._hoveredTarget) {
            canvas.fire('object:out', { target: this._hoveredTarget })
            this._hoveredTarget = null
          }
          return target
        }
      })(canvas.findTarget)
    },
    onObjectSelected(e) {
      const selectedObject = e.target
      //   $('#text-string').val('')
      selectedObject.hasRotatingPoint = true
      if (selectedObject && selectedObject.type === 'text') {
        // display text editor
        // $('#texteditor').css('display', 'block')
        // $('#text-string').val(selectedObject.getText())
        // $('#text-fontcolor').miniColors('value', selectedObject.fill)
        // $('#text-strokecolor').miniColors('value', selectedObject.strokeStyle)
        // $('#imageeditor').css('display', 'block')
      } else if (selectedObject && selectedObject.type === 'image') {
        // display image editor
        // $('#texteditor').css('display', 'none')
        // $('#imageeditor').css('display', 'block')
      }
    },
    onSelectedCleared(e) {
      //   $('#texteditor').css('display', 'none')
      //   $('#text-string').val('')
      //   $('#imageeditor').css('display', 'none')
    },
    onAvatarClick(e) {
      const el = e.target
      const offset = 50
      const left = fabric.util.getRandomInt(0 + offset, 200 - offset)
      const top = fabric.util.getRandomInt(0 + offset, 400 - offset)
      const canvas = this.canvas
      //   var angle = fabric.util.getRandomInt(-20, 40)
      //   var width = fabric.util.getRandomInt(30, 50)
      //   var opacity = (function (min, max) {
      //     return Math.random() * (max - min) + min
      //   })(0.5, 1)

      fabric.Image.fromURL(el.src, function (image) {
        image.set({
          left: left,
          top: top,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        })
        // image.scale(getRandomNum(0.1, 0.25)).setCoords();
        canvas.add(image)
      })
    },
    onColorClick(e, color) {
      this.shirtColor = color
    },
    onMouseOverDA() {
      this.canvas.add(this.line1)
      this.canvas.add(this.line2)
      this.canvas.add(this.line3)
      this.canvas.add(this.line4)
      this.canvas.renderAll()
    },
    onMouseOutDA() {
      this.canvas.remove(this.line1)
      this.canvas.remove(this.line2)
      this.canvas.remove(this.line3)
      this.canvas.remove(this.line4)
      this.canvas.renderAll()
    }
  },
  mounted() {
    this.initFabric()
  }
}
</script>

<style scoped>
.shirt-wrapper {
  width: 530px;
  height: 630px;
  position: relative;
}
.avatar-list,
.color-list {
  list-style: none;
}
.drawing-area {
  position: absolute;
  top: 100px;
  left: 160px;
  z-index: 10;
  width: 200px;
  height: 400px;
}
.color-preview {
  border: 1px solid #ccc;
  margin: 2px;
  zoom: 1;
  display: inline-block;
  cursor: pointer;
  overflow: hidden;
  width: 20px;
  height: 20px;
  display: block;
}
</style>
