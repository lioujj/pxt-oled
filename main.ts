/**
* LUMEX OLED顯示器的函數
*/

//% weight=0 color=#ff9933 icon="\uf109" block="LumexOLED"
namespace lumexoled {
    export enum fontSize {
        //% block="5*7"
        smallSize = 0x81,
        //% block="8*16"
        bigSize = 0x83
    }
    export enum showNow {
        //% block="now"
        yes = 0xd1,
        //% block="later"
        no = 0x00
    }
    export enum patternType {
        //% block="8*8"
        type1 = 0xc0,
        //% block="8*16"
        type2 = 0xc1,
        //% block="16*16"
        type3 = 0xc2,
        //% block="32*32"
        type4 = 0xc3
    }
    export enum imageType {
        //% block="8*8"
        type1 = 0xc4,
        //% block="8*16"
        type2 = 0xc5,
        //% block="16*16"
        type3 = 0xc6,
        //% block="32*32"
        type4 = 0xc7
    }
    export enum positiveType {
        //% block="positive"
        type1 = 1,
        //% block="negative"
        type2 = 0
    }
    export enum filledType {
        //% block="no"
        type1 = 0,
        //% block="yes"
        type2 = 1
    }
    export enum transitionType {
        //% block="upward"
        type1 = 0,
        //% block="downward"
        type2 = 1,
        //% block="leftward"
        type3 = 2,
        //% block="rightward"
        type4 = 3
    }
    export enum moveType {
        //% block="inside out"
        type1 = 0,
        //% block="outside in"
        type2 = 1
    }

    //% blockId="OLED_setSerial" block="set OLED RX to %pinRX|TX to %pinTX|BaudRate %br"
    //% weight=100 blockExternalInputs=true blockGap=0
    export function OLED_setSerial(pinRX: SerialPin, pinTX: SerialPin, br: BaudRate): void {
        basic.pause(100)
        serial.redirect(
            pinRX,
            pinTX,
            br
        )
        serial.readUntil("E")
        basic.pause(100)
        OLED_clear()
    }

    //% blockId="OLED_display" block="OLED display"
    //% weight=94 blockGap=0
    export function OLED_display(): void {
        let myBuff1 = pins.createBuffer(1)
        myBuff1.setNumber(NumberFormat.UInt8BE, 0, 0xd1)
        serial.writeBuffer(myBuff1)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="OLED_clear" block="OLED clear"
    //% weight=93 blockGap=0
    export function OLED_clear(): void {
        let myBuff1 = pins.createBuffer(1)
        myBuff1.setNumber(NumberFormat.UInt8BE, 0, 0xd0)
        serial.writeBuffer(myBuff1)
        //serial.readUntil("E")
        basic.pause(20)
    }

    //% blockId="OLED_on" block="turn OLED on"
    //% weight=92 blockGap=0
    export function OLED_on(): void {
        let myBuff1 = pins.createBuffer(1)
        myBuff1.setNumber(NumberFormat.UInt8BE, 0, 0xf1)
        serial.writeBuffer(myBuff1)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="OLED_off" block="turn OLED off"
    //% weight=91 blockGap=0
    export function OLED_off(): void {
        let myBuff1 = pins.createBuffer(1)
        myBuff1.setNumber(NumberFormat.UInt8BE, 0, 0xf0)
        serial.writeBuffer(myBuff1)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="OLED_setBrightess" block="set OLED brightness %brightness"
    //% weight=90 blockGap=0 brightness.min=1 brightness.max=255
    export function OLED_setBrightness(brightness: number): void {
        let myBuff2 = pins.createBuffer(2)
        myBuff2.setNumber(NumberFormat.UInt8BE, 0, 0xf2)
        myBuff2.setNumber(NumberFormat.UInt8BE, 1, brightness)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="OLED_putString" block="OLED put string: %myStr|size: %mySize|on line: %line|column: %column|display %showState"
    //% weight=85 blockGap=0 blockExternalInputs=true line.min=0 line.max=7 column.min=0 column.max=20
    export function putString(myStr: string, mySize: fontSize, line: number, column: number, showState: showNow): void {
        if (myStr.length > 0) {
            //sending = true
            let maxLength = myStr.length
            if (maxLength > 16)
                maxLength = 16
            let myBuff = pins.createBuffer(maxLength + 3)
            myBuff.setNumber(NumberFormat.UInt8BE, 0, mySize)
            myBuff.setNumber(NumberFormat.UInt8BE, 1, line)
            myBuff.setNumber(NumberFormat.UInt8BE, 2, column)
            for (let i = 0; i < maxLength; i++) {
                myBuff.setNumber(NumberFormat.UInt8BE, i + 3, myStr.charCodeAt(i))
            }
            serial.writeBuffer(myBuff)
            serial.readUntil("E")
            basic.pause(10)
            if ((myStr.length > 16) && (mySize == 0x81)) {
                myStr = myStr.substr(16)
                maxLength = myStr.length
                if (maxLength > 16)
                    maxLength = 16
                myBuff = pins.createBuffer(maxLength + 3)
                myBuff.setNumber(NumberFormat.UInt8BE, 0, mySize)
                myBuff.setNumber(NumberFormat.UInt8BE, 1, line)
                myBuff.setNumber(NumberFormat.UInt8BE, 2, column + 16)
                for (let i = 0; i < maxLength; i++) {
                    myBuff.setNumber(NumberFormat.UInt8BE, i + 3, myStr.charCodeAt(i))
                }
                serial.writeBuffer(myBuff)
                serial.readUntil("E")
                basic.pause(10)
            }
            if (showState == 0xd1) {
                OLED_display()
            }
        }

    }
    //% blockId="OLED_putNumber" block="OLED put number: %myNumber|size: %mySize|on line: %line|column: %column|display %showState"
    //% weight=84 blockGap=0 blockExternalInputs=true line.min=0 line.max=7 column.min=0 column.max=20
    export function putNumber(myNumber: number, mySize: fontSize, line: number, column: number, showState: showNow): void {
        putString(myNumber.toString(), mySize, line, column, showState)
    }

    //% blockId="OLED_setImage" block="set image array %myArray|image type: %myType|positive or negative %myPositive|to OLED memory image ID: %myID"
    //% weight=83 blockGap=0 blockExternalInputs=true myID.min=0 myID.max=9 advanced=true
    export function OLED_setImage(myArray: number[], myType: patternType, myPositive: positiveType, myID: number): void {
        let myBuff2 = pins.createBuffer(2)
        let myBuff1 = pins.createBuffer(1)
        myBuff2.setNumber(NumberFormat.UInt8BE, 0, myType)
        myBuff2.setNumber(NumberFormat.UInt8BE, 1, myID)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
        for (let i = 0; i <= myArray.length - 1; i++) {
            myBuff1.setNumber(NumberFormat.UInt8BE, 0, (myPositive == 1 ? myArray[i] : 0xff - myArray[i]))
            serial.writeBuffer(myBuff1)
            serial.readUntil("E")
            basic.pause(10)
        }
    }

    //% blockId="OLED_showImage" block="show image type: %myType|image ID: %myID|on x: %x|y: %y|display %showState"
    //% weight=82 blockGap=0 blockExternalInputs=true myID.min=0 myID.max=9 advanced=true
    export function OLED_showImage(myType: imageType, myID: number, x: number, y: number, showState: showNow): void {
        let myBuff4 = pins.createBuffer(4)
        myBuff4.setNumber(NumberFormat.UInt8BE, 0, myType)
        myBuff4.setNumber(NumberFormat.UInt8BE, 1, x)
        myBuff4.setNumber(NumberFormat.UInt8BE, 2, y)
        myBuff4.setNumber(NumberFormat.UInt8BE, 3, myID)
        serial.writeBuffer(myBuff4)
        serial.readUntil("E")
        basic.pause(10)
        if (showState == 0xd1) {
            OLED_display()
        }
    }


    //% blockId="OLED_drawLine" block="draw a line|positive or negative %myPositive|first point X %x0|first point Y %y0|second point X %x1|second point Y %y1|display %showState"
    //% weight=79 blockGap=0 x0.min=0 x0.max=127 y0.min=0 y0.max=63 x1.min=0 x1.max=127 y1.min=0 y1.max=63 advanced=true
    export function OLED_drawLine(myPositive: positiveType, x0: number, y0: number, x1: number, y1: number, showState: showNow): void {
        let myBuff6 = pins.createBuffer(6)
        myBuff6.setNumber(NumberFormat.Int8BE, 0, 0x90)
        myBuff6.setNumber(NumberFormat.Int8BE, 1, x0)
        myBuff6.setNumber(NumberFormat.Int8BE, 2, y0)
        myBuff6.setNumber(NumberFormat.Int8BE, 3, x1)
        myBuff6.setNumber(NumberFormat.Int8BE, 4, y1)
        myBuff6.setNumber(NumberFormat.Int8BE, 5, myPositive)
        serial.writeBuffer(myBuff6)
        serial.readUntil("E")
        basic.pause(10)
        if (showState == 0xd1) {
            OLED_display()
        }
    }

    //% blockId="OLED_drawRectangle" block="draw a rectangle|filled %myFilled|positive or negative %myPositive|up left corner X %x0|up left corner Y %y0|bottom right corner X %x1|bottom right corner Y %y1|display %showState"
    //% weight=78 blockGap=0 x0.min=0 x0.max=127 y0.min=0 y0.max=63 x1.min=0 x1.max=127 y1.min=0 y1.max=63 advanced=true
    export function OLED_drawRectangle(myFilled: filledType, myPositive: positiveType, x0: number, y0: number, x1: number, y1: number, showState: showNow): void {
        let myBuff6 = pins.createBuffer(6)
        if (myFilled == 0)
            myBuff6.setNumber(NumberFormat.Int8BE, 0, 0x91)
        else
            myBuff6.setNumber(NumberFormat.Int8BE, 0, 0x92)
        myBuff6.setNumber(NumberFormat.Int8BE, 1, x0)
        myBuff6.setNumber(NumberFormat.Int8BE, 2, y0)
        myBuff6.setNumber(NumberFormat.Int8BE, 3, x1)
        myBuff6.setNumber(NumberFormat.Int8BE, 4, y1)
        myBuff6.setNumber(NumberFormat.Int8BE, 5, myPositive)
        serial.writeBuffer(myBuff6)
        serial.readUntil("E")
        basic.pause(10)
        if (showState == 0xd1) {
            OLED_display()
        }
    }

    //% blockId="OLED_drawCircle" block="draw a circle|filled %myFilled|positive or negative %myPositive|center X %x0|center Y %y0|radius %radius|display %showState"
    //% weight=77 blockGap=0 x0.min=0 x0.max=127 y0.min=0 y0.max=63 advanced=true
    export function OLED_drawCircle(myFilled: filledType, myPositive: positiveType, x0: number, y0: number, radius: number, showState: showNow): void {
        let myBuff5 = pins.createBuffer(5)
        if (myFilled == 0)
            myBuff5.setNumber(NumberFormat.Int8BE, 0, 0x94)
        else
            myBuff5.setNumber(NumberFormat.Int8BE, 0, 0x95)
        myBuff5.setNumber(NumberFormat.Int8BE, 1, x0)
        myBuff5.setNumber(NumberFormat.Int8BE, 2, y0)
        myBuff5.setNumber(NumberFormat.Int8BE, 3, radius)
        myBuff5.setNumber(NumberFormat.Int8BE, 4, myPositive)
        serial.writeBuffer(myBuff5)
        serial.readUntil("E")
        basic.pause(10)
        if (showState == 0xd1) {
            OLED_display()
        }
    }

    //% blockId="OLED_drawSquare" block="draw a square|positive or negative %myPositive|up left corner X %x0|up left corner Y %y0|width %width|display %showState"
    //% weight=76 blockGap=0 x0.min=0 x0.max=127 y0.min=0 y0.max=63 advanced=true
    export function OLED_drawSquare(myPositive: positiveType, x0: number, y0: number, width: number, showState: showNow): void {
        let myBuff5 = pins.createBuffer(5)
        myBuff5.setNumber(NumberFormat.Int8BE, 0, 0x93)
        myBuff5.setNumber(NumberFormat.Int8BE, 1, x0)
        myBuff5.setNumber(NumberFormat.Int8BE, 2, y0)
        myBuff5.setNumber(NumberFormat.Int8BE, 3, width)
        myBuff5.setNumber(NumberFormat.Int8BE, 4, myPositive)
        serial.writeBuffer(myBuff5)
        serial.readUntil("E")
        basic.pause(10)
        if (showState == 0xd1) {
            OLED_display()
        }
    }

    //% blockId="OLED_setPixel" block="draw a pixel|positive or negative %myPositive|X %x0|Y %y0|display %showState"
    //% weight=75 blockGap=0 x0.min=0 x0.max=127 y0.min=0 y0.max=63 advanced=true
    export function OLED_setPixel(myPositive: positiveType, x0: number, y0: number, showState: showNow): void {
        let myBuff3 = pins.createBuffer(3)
        if (myPositive == 1)
            myBuff3.setNumber(NumberFormat.Int8BE, 0, 0x9e)
        else
            myBuff3.setNumber(NumberFormat.Int8BE, 0, 0x9f)
        myBuff3.setNumber(NumberFormat.Int8BE, 1, x0)
        myBuff3.setNumber(NumberFormat.Int8BE, 2, y0)
        serial.writeBuffer(myBuff3)
        serial.readUntil("E")
        basic.pause(10)
        if (showState == 0xd1) {
            OLED_display()
        }
    }

    //% blockId="OLED_setTransition" block="scroll the whole display %transition|shift time(1~200ms) %time"
    //% weight=69 blockGap=0 time.min=1 time.max=200
    export function OLED_setTransition(transition: transitionType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        let myBuff2 = pins.createBuffer(2)
        myBuff2.setNumber(NumberFormat.Int8BE, 0, transition + 0xd2)
        myBuff2.setNumber(NumberFormat.Int8BE, 1, time)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
    }
    //% blockId="OLED_setSecTransition" block="scroll the section display %transition|section up left corner X: %x0|up left corner Y: %y0|bottom right corner X: %x1|borrom right corner Y: %y1|shift time(1~200ms) %time"
    //% weight=68 blockGap=0 x0.min=0 x0.max=127 y0.min=0 y0.max=63 x1.min=0 x1.max=127 y1.min=0 y1.max=63 time.min=1 time.max=200
    export function OLED_setSecTransition(transition: transitionType, x0: number, y0: number, x1: number, y1: number, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        let myBuff6 = pins.createBuffer(6)
        myBuff6.setNumber(NumberFormat.Int8BE, 0, transition + 0xd6)
        myBuff6.setNumber(NumberFormat.Int8BE, 1, x0)
        myBuff6.setNumber(NumberFormat.Int8BE, 2, y0)
        myBuff6.setNumber(NumberFormat.Int8BE, 3, x1)
        myBuff6.setNumber(NumberFormat.Int8BE, 4, y1)
        myBuff6.setNumber(NumberFormat.Int8BE, 5, time)
        serial.writeBuffer(myBuff6)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="eraseImageRect" block="erase the whole dispay %transition|shift time(1~200ms) %time"
    //% weight=67 blockGap=0 time.min=1 time.max=200
    export function eraseImageRect(transition: transitionType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        let myBuff2 = pins.createBuffer(2)
        myBuff2.setNumber(NumberFormat.Int8BE, 0, transition + 0xa4)
        myBuff2.setNumber(NumberFormat.Int8BE, 1, time)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
    }
    //% blockId="showImageRect" block="display the whole dispay %transition|shift time(1~200ms) %time"
    //% weight=66 blockGap=0 time.min=1 time.max=200
    export function showImageRect(transition: transitionType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        let myBuff2 = pins.createBuffer(2)
        myBuff2.setNumber(NumberFormat.Int8BE, 0, transition + 0xa0)
        myBuff2.setNumber(NumberFormat.Int8BE, 1, time)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="eraseImageInOut" block="erase the whole display %myMove|shift time(1~200ms) %time"
    //% weight=65 blockGap=0 time.min=1 time.max=200
    export function eraseImageInOut(myMove: moveType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        let myBuff2 = pins.createBuffer(2)
        myBuff2.setNumber(NumberFormat.Int8BE, 0, myMove + 0xaa)
        myBuff2.setNumber(NumberFormat.Int8BE, 1, time)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
    }

    //% blockId="showImageInOut" block="display the whole display %myMove|shift time(1~200ms) %time"
    //% weight=64 blockGap=0 time.min=1 time.max=200
    export function showImageInOut(myMove: moveType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        let myBuff2 = pins.createBuffer(2)
        myBuff2.setNumber(NumberFormat.Int8BE, 0, myMove + 0xa8)
        myBuff2.setNumber(NumberFormat.Int8BE, 1, time)
        serial.writeBuffer(myBuff2)
        serial.readUntil("E")
        basic.pause(10)
    }
}   
