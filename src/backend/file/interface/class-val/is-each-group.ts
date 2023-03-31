import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import {Injectable} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindGroupQuery } from 'src/backend/group/application/query/group-find.query';


@ValidatorConstraint({ name: 'IsEachGroup', async: true })
@Injectable() // this is needed in order to the class be injected into the module
export class IsEachGroup implements ValidatorConstraintInterface {
    constructor(private queryBus: QueryBus) {}
    async validate(groups: string[], args: ValidationArguments): Promise<boolean> {
        if (groups == undefined)
            return true;

        const findGroupFunc = (group: string) => {
            const query = new FindGroupQuery(group);
            return this.queryBus.execute(query);
        };

        const validateResults: boolean[] = await Promise.all(groups.map(findGroupFunc));
        return validateResults.every((result) => result);
    }
}